const Receipt = require('../models/receiptModel');
const Product = require('../models/productModel');
const ReceiptDetail = require('../models/receiptDetailModel');
const factory = require('../controllers/handlerFactory');
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
exports.getDetailReceipt = factory.getOne(Receipt);
exports.deleteReceipt = factory.deleteOne(Receipt);

exports.createReceipt = catchAsync(async (req, res, next) => {
  let totalPrice = 0;
  let idSupplier;
  let idProductDetail;
  req.body.map((item, index) => {
    totalPrice += item.totalPrice;
    idSupplier = item.idSupplier;
    idProductDetail = item.idProductDetail;
  });
  req.body.idAdmin = req.user.id;
  req.body.totalPrice = totalPrice;
  req.body.idSupplier = idSupplier;

  const objReceipt = filterObj(
    req.body,
    'totalPrice',
    'idSupplier',
    'idAdmin',
    'idProductDetail'
  );

  const receipt = await Receipt.create(objReceipt);

  if (receipt._id) {
    req.body.map((item, index) => {
      req.body[index].idReceipt = receipt._id;
    });
    await ReceiptDetail.insertMany(req.body);
  }

  res.status(201).json({
    status: 'success',
    result: receipt.length,
    data: receipt,
  });
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
