const factory = require('../controllers/handlerFactory');
const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');

exports.getDetailCategory = factory.getOne();
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
exports.createCategory = factory.createOne(Category);
exports.getAllCategory = factory.getAll(Category);
