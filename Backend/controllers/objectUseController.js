const factory = require('./handlerFactory');
const ObjectUse = require('../models/objectUseModel');

exports.getDetailObjectUse = factory.getOne();
exports.updateObjectUse = factory.updateOne(ObjectUse);
exports.deleteObjectUse = factory.deleteOne(ObjectUse);
exports.createObjectUse = factory.createOne(ObjectUse);
exports.getAllObjectUse = factory.getAll(ObjectUse);
