const factory = require('../controllers/handlerFactory');
const Shoes = require('../models/shoesModel');
const catchAsync = require('../utils/catchAsync');

exports.getDetailShoes = factory.getOne();
exports.updateShoes = factory.updateOne(Shoes);
exports.deleteShoes = factory.deleteOne(Shoes);
exports.createShoes = factory.createOne(Shoes);
exports.getAllShoes = factory.getAll(Shoes);
