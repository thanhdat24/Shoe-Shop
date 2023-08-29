const factory = require('../controllers/handlerFactory');
const Receipt = require('../models/receiptModel');
const Supplier = require('../models/supplierModel');
const catchAsync = require('../utils/catchAsync');

exports.getDetailSupplier = factory.getOne(Supplier);
exports.updateSupplier = factory.updateOne(Supplier);
exports.deleteSupplier = factory.deleteOne(Supplier);
exports.createSupplier = catchAsync(async (req, res, next) => {
  // Destructuring assignment với giá trị mặc định
  const {
    address = '',
    ward = { name: '' },
    district = { name: '' },
    city = { name: '' },
  } = req.body;

  // Tạo fullAddress từ các phần tồn tại
  const fullAddress = [
    address,
    ward && ward.name ? ward.name : '',
    district && district.name ? district.name : '',
    city && city.name ? city.name : '',
  ]
    .filter((val) => val !== undefined && val !== null && val !== '')
    .join(', ');
  // Cập nhật req.body
  req.body = {
    ...req.body,
    address,
    ward: ward && ward.name ? ward.name : '',
    district: district && district.name ? district.name : '',
    city: city && city.name ? city.name : '',
    fullAddress,
  };

  factory.createOne(Supplier)(req, res, next);
});

exports.getAllSupplier = catchAsync(async (req, res, next) => {
  const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
  const receipts = await Receipt.find({}).sort({ createdAt: -1 });

  const supplierInfo = new Map();

  // Tính tổng tiền và nợ cho từng nhà cung cấp
  receipts.forEach((receipt) => {
    const supplierId = receipt.supplier.id;
    const supplierCost = receipt.supplierCost;
    const supplierPaidCost = receipt.supplierPaidCost;

    const paymentHistory = receipt.paymentHistory || [];

    if (!supplierInfo.has(supplierId)) {
      supplierInfo.set(supplierId, {
        totalCost: 0,
        totalDebt: 0,
      });
    }

    const currentInfo = supplierInfo.get(supplierId);
    currentInfo.totalCost += supplierCost;
    currentInfo.totalDebt += supplierCost - supplierPaidCost;
    currentInfo.paymentHistory = paymentHistory;
  });

  // Tạo mảng object chứa thông tin tổng tiền và nợ của từng nhà cung cấp
  const suppliersWithInfo = suppliers.map((supplier) => {
    const supplierId = supplier.id.toString();
    const info = supplierInfo.get(supplierId) || { totalCost: 0, totalDebt: 0 };
    return {
      ...supplier.toObject(),
      totalCost: info.totalCost,
      totalDebt: info.totalDebt,
      paymentHistory: info.paymentHistory,
    };
  });

  res.status(200).json({
    status: 'success',
    length: suppliersWithInfo.length,
    data: suppliersWithInfo,
  });
});
