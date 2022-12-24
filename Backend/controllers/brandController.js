const factory = require('./handlerFactory');
const Brand = require('../models/brandModel');

exports.getDetailBrand = factory.getOne();
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.getAllBrand = factory.getAll(Brand);
