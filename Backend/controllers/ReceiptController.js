const Receipt = require('../models/receiptModel');
const Product = require('../models/productModel');
const ReceiptDetail = require('../models/receiptDetailModel');
const ProductDetail = require('../models/productDetailModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const _ = require('lodash');
const moment = require('moment');

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllReceipt = factory.getAll(Receipt, { path: 'receiptDetail' });
exports.getDetailReceipt = catchAsync(async (req, res, next) => {
  const query = req.params.id;
  const doc = await Receipt.findOne({ receiptCode: query }).populate(
    'receiptDetail'
  );

  if (!doc) {
    return next(new AppError('Không tìm thấy mã phiếu nhập', 404));
  }

  res.status(200).json({
    status: 'success',
    length: 1,
    data: doc,
  });
});

exports.deleteReceipt = factory.deleteOne(Receipt);

exports.createReceipt = catchAsync(async (req, res, next) => {
  try {
    const { inventoryData, totalPrice, inventoryStatus } = req.body;

    let validInventoryData = inventoryData;

    if (inventoryStatus !== 1) {
      validInventoryData = inventoryData.filter((item) => item.quantity > 0);
    }

    const totalQuantity = inventoryData.reduce(
      (total, item) => total + item.quantity,
      0
    );

    if (totalQuantity <= 0 && inventoryStatus !== 1) {
      return next(new AppError('Tổng số lượng nhập phải lớn hơn 0', 400));
    }

    // Tìm mã phiếu nhập hàng lớn nhất hiện có
    const lastReceipt = await Receipt.findOne(
      {},
      { receiptCode: 1 },
      { sort: { receiptCode: -1 } }
    );

    let nextReceiptCode = 'IR100000'; // Mã mặc định nếu không có phiếu nhập hàng nào

    if (lastReceipt) {
      // Lấy số phiếu nhập hàng từ mã cuối cùng và tăng lên 1 đơn vị
      const lastReceiptNumber = parseInt(
        lastReceipt.receiptCode.substring(2),
        10
      );
      nextReceiptCode = `IR${lastReceiptNumber + 1}`;
    }

    const receiptData = {
      ...req.body,
      supplierCost: totalPrice,
      supplierPaidCost: 0,
      receiptCode: nextReceiptCode,
    };

    const receipt = await Receipt.create(receiptData);
    if (receipt._id) {
      const receiptDetailData = validInventoryData.map((item, index) => ({
        price: item.price || 0,
        quantity: item.quantity || 0,
        totalPrice: (item.price || 0) * (item.quantity || 1),
        idReceipt: receipt._id,
        idProductDetail: item.id,
      }));
      await ReceiptDetail.insertMany(receiptDetailData);

      validInventoryData.forEach(async (detail) => {
        const productDetail = await ProductDetail.findOne({ _id: detail.id });

        if (productDetail) {
          const totalQuantity = productDetail.quantity + detail.quantity;

          // Cập nhật quantity của ProductDetail
          await ProductDetail.updateOne(
            { _id: detail.id },
            { $set: { quantity: totalQuantity } }
          );
        }
      });
    } else {
      return next(new AppError('Không thể tạo phiếu nhập hàng', 404));
    }

    res.status(201).json({
      status: 'success',
      result: receipt.length,
      data: receipt,
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({
      status: 'error',
      message: 'Nhập hàng không thành công',
    });
  }
});
exports.updateReceiptDraft = catchAsync(async (req, res, next) => {
  const _id = req.params.id;
  console.log('_id', _id);
  const doc = await Receipt.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('Không tìm thấy phiếu nhập hàng', 404));
  }

  const updates = [];
  const deletePromises = [];

  for (const detail of req.body.receiptDetail) {
    if (detail.quantity === 0) {
      deletePromises.push(ReceiptDetail.findByIdAndDelete(detail.id));
    } else {
      const totalPrice = detail.quantity * detail.price;
      updates.push({
        updateOne: {
          filter: { _id: detail.id },
          update: { $set: { ...detail, totalPrice } },
        },
      });
    }
  }

  if (deletePromises.length > 0) {
    await Promise.all(deletePromises);
  }

  if (updates.length > 0) {
    const result = await ReceiptDetail.bulkWrite(updates);
    res.status(200).json({
      status: 'success',
      result: result.modifiedCount,
      data: result,
    });
  } else {
    res.status(200).json({
      status: 'success',
      result: 0,
      data: [],
    });
  }
});

exports.updateReceipt = factory.updateOne(Receipt);

exports.makeSupplierPayment = catchAsync(async (req, res, next) => {
  const _id = req.params.id;
  const { supplierPaidCost, paymentHistory } = req.body;
  // Tìm phiếu nhập hàng dựa trên _id
  const receipt = await Receipt.findById(_id);

  if (!receipt) {
    return next(new AppError('Không tìm thấy phiếu nhập hàng', 404));
  }
  receipt.supplierPaidCost = receipt.supplierPaidCost + supplierPaidCost;

  // Tính toán casNumber mới cho khoản thanh toán
  let newCasNumber = 'CPIR100000'; // Giá trị mặc định
  if (receipt.paymentHistory.length > 0) {
    const lastPayment =
      receipt.paymentHistory[receipt.paymentHistory.length - 1];

    const lastCasNumber = lastPayment.casNumber;
    const casNumberParts = lastCasNumber.split('CPIR');
    const lastCasNumberValue = parseInt(casNumberParts[1]);
    newCasNumber = `CPIR${(lastCasNumberValue + 1)
      .toString()
      .padStart(6, '0')}`;
  }

  // Tạo khoản thanh toán mới
  const newPayment = {
    casNumber: newCasNumber,
    // reasonName: paymentHistory.reasonName || 'Chi tiền trả NCC',
    amount: supplierPaidCost,
    // tranDate: paymentHistory.tranDate || Date.now(),
    paymentMethod: paymentHistory.paymentMethod, // Cần đảm bảo paymentMethod đã được định nghĩa trong yêu cầu
    paidBy: req.user._id,
  };

  // Thêm khoản thanh toán mới vào paymentHistory
  receipt.paymentHistory.push(newPayment);

  // Lưu phiếu nhập hàng đã cập nhật
  const updatedReceipt = await receipt.save();

  res.status(200).json({
    status: 'success',
    result: updatedReceipt.paymentHistory.length,
    data: updatedReceipt,
  });
});

exports.receiptRevenueStatisticsForWeek = catchAsync(async (req, res, next) => {
  let array = await Receipt.find({
    createdAt: {
      $gte: moment().day(-6).toDate(),
      $lt: moment().startOf('week').isoWeekday(8).toDate(),
    },

    inventoryStatus: true,
  }).sort({ createdAt: 1 });
  let result = _(array)
    .groupBy((x) => moment(x.createdAt).format('DD-MM-YYYY'))
    .map((value, key) => ({ name: key, receiptRevenue: value }))
    .value();

  try {
    res.status(200).json({
      status: 'success',
      result: result.length,
      data: result,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
exports.receiptRevenueStatisticsForMonth = catchAsync(
  async (req, res, next) => {
    let array = await Receipt.find({
      inventoryStatus: true,
      // updatedAt,
    }).sort({ createdAt: 1 });

    let result = _(array)
      .groupBy((x) => moment(x.createdAt).format('DD-MM-YYYY'))
      .map((value, key) => ({
        name: key,
        receiptRevenue: value,
      }))
      .value();
    let result1 = _(result)
      .groupBy((x) => moment(x.receiptRevenue[0].createdAt).format('MM-YYYY'))
      .map((value, key) => ({
        // name: moment(new Date(key)).format('MM'),
        name: key,
        receiptRevenue: value,
      }))
      .value();
    let receiptMonth = moment().toDate();

    let receiptMonthFormat = moment(receiptMonth).format('MM-YYYY');

    let receiptByMonth = result1.filter(
      (item) => item.name === receiptMonthFormat
    );
    try {
      res.status(200).json({
        status: 'success',
        result: receiptByMonth.length,
        data: receiptByMonth,
      });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  }
);

exports.receiptRevenueStatisticsForYear = catchAsync(async (req, res, next) => {
  let array = await Receipt.find({
    inventoryStatus: true,
  }).sort({ createdAt: 1 });
  let result = _(array)
    .groupBy((x) => moment(x.createdAt).format('MM-YYYY'))
    .map((value, key) => ({ name: key, receiptRevenue: value }))
    .value();

  try {
    res.status(200).json({
      status: 'success',
      result: result.length,
      data: result,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
