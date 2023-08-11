const factory = require('../controllers/handlerFactory');
const Supplier = require('../models/supplierModel');

exports.getDetailSupplier = factory.getOne(Supplier);
exports.updateSupplier = factory.updateOne(Supplier);
exports.deleteSupplier = factory.deleteOne(Supplier);
exports.createSupplier = (req, res, next) => {

  // Destructuring assignment với giá trị mặc định
  const {
    address = '',
    ward = { name: '' },
    district = { name: '' },
    city = { name: '' },
  } = req.body;

  // Tạo fullAddress từ các phần tồn tại
  const fullAddress = [address, ward.name, district.name, city.name]
    .filter(Boolean)
    .join(', ');

  // Cập nhật req.body
  req.body = {
    ...req.body,
    address,
    ward: ward.name,
    district: district.name,
    city: city.name,
    fullAddress,
  };

  factory.createOne(Supplier)(req, res, next);
};


exports.getAllSupplier = factory.getAll(Supplier);
