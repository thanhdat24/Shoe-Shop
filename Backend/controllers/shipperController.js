const factory = require('./handlerFactory');
const Shipper = require('../models/shipperModel');

exports.getDetailShipper = factory.getOne();
exports.updateShipper = factory.updateOne(Shipper);
exports.deleteShipper = factory.deleteOne(Shipper);
exports.createShipper = factory.createOne(Shipper);
exports.getAllShipper = factory.getAll(Shipper);
