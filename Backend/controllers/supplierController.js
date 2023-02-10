const factory = require('../controllers/handlerFactory');
const Supplier = require('../models/supplierModel');

exports.getDetailSupplier = factory.getOne(Supplier);
exports.updateSupplier = factory.updateOne(Supplier);
exports.deleteSupplier = factory.deleteOne(Supplier);
exports.createSupplier = factory.createOne(Supplier);
exports.getAllSupplier = factory.getAll(Supplier);
