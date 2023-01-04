const OrderDetail = require('../models/orderDetailModel');
const factory = require('../controllers/handlerFactory');

exports.getAllOrderDetail = factory.getAll(OrderDetail);
exports.createOrderDetail = factory.createOne(OrderDetail);
