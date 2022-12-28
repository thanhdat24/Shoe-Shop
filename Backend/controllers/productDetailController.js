const factory = require('./handlerFactory');
const ProductDetail = require('../models/productDetailModel');

exports.getDetailProductDetail = factory.getOne(ProductDetail);
exports.updateProductDetail = factory.updateOne(ProductDetail);
exports.deleteProductDetail = factory.deleteOne(ProductDetail);
exports.createProductDetail = factory.createOne(ProductDetail);
exports.getAllProductDetail = factory.getAll(ProductDetail);
