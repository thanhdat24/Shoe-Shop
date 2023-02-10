const ReceiptDetail = require('../models/receiptDetailModel');
const factory = require('../controllers/handlerFactory');

exports.getAllReceiptDetail = factory.getAll(ReceiptDetail);
exports.createReceiptDetail = factory.createOne(ReceiptDetail);
exports.getDetailReceiptDetail = factory.getOne(ReceiptDetail);

