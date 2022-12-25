const factory = require('./handlerFactory');
const Color = require('../models/colorModel');


exports.getDetailColor = factory.getOne();
exports.updateColor = factory.updateOne(Color);
exports.deleteColor = factory.deleteOne(Color);
exports.createColor = factory.createOne(Color);
exports.getAllColor = factory.getAll(Color);
