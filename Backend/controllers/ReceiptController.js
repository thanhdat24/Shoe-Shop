const Receipt = require('../models/receiptModel');
const Product = require('../models/productModel');
const ReceiptDetail = require('../models/receiptDetailModel');
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
      debt: req.body.totalPrice,
      receiptCode: nextReceiptCode,
    };

    const receipt = await Receipt.create(receiptData);

    if (receipt._id) {
      const receiptDetailData = req.body.inventoryData.map((item, index) => ({
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
        idReceipt: receipt._id,
        idProductDetail: item.id,
      }));
      await ReceiptDetail.insertMany(receiptDetailData);
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
      message: 'An error occurred while creating the receipt.',
    });
  }
});

exports.updateReceipt = catchAsync(async (req, res, next) => {
  const _id = req.params.id;

  let doc = await Receipt.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  let query = Product.findById(req.body.bookId);
  let book = await query;
  console.log('book', book);

  book.quantity = book.quantity + req.body.quantity;
  await book.save();

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: doc,
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
    console.log(
      ' receiptMonth.getMonth()',
      moment(receiptMonth).format('MM-YYYY')
    );
    let receiptMonthFormat = moment(receiptMonth).format('MM-YYYY');

    let receiptByMonth = result1.filter(
      (item) => item.name === receiptMonthFormat
    );
    console.log('receiptByMonth', receiptByMonth);
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
  console.log('array', array);
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
