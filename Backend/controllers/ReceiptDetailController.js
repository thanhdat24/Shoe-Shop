const ReceiptDetail = require('../models/receiptDetailModel');
const factory = require('./handlerFactory');

exports.getAllReceiptDetail = factory.getAll(ReceiptDetail);
exports.createReceiptDetail = factory.createOne(ReceiptDetail);
exports.getDetailReceiptDetail = factory.getOne(ReceiptDetail);

