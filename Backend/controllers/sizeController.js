const factory = require('./handlerFactory');
const Size = require('../models/sizeModel');

exports.getDetailSize = factory.getOne();
exports.updateSize = factory.updateOne(Size);
exports.deleteSize = factory.deleteOne(Size);
exports.createSize = factory.createOne(Size);
exports.getAllSize = factory.getAll(Size, '', true);
