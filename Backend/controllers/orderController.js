const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Product = require('../models/productModel');
const ProductDetail = require('../models/productDetailModel');
const ProductImages = require('../models/productImagesModel');
const Promotion = require('../models/promotionModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const _ = require('lodash');
const moment = require('moment');

exports.getAllOrder = factory.getAll(Order, { path: 'orderDetail' });
exports.getMeOrder = catchAsync(async (req, res, next) => {
  let query = Order.find(req.query).populate('orderDetail');
  const doc = await query;
  let filterDoc = doc.filter((item) => item.idUser.id === req.user.id);

  filterDoc.sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).json({
    status: 'success',
    length: filterDoc.length,
    data: filterDoc,
  });
});
exports.getDetailOrder = factory.getOne(Order, { path: 'orderDetail' });

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  console.log('req.user', req.user);
  try {
    req.body.idUser = _id;
    const objOrder = filterObj(
      req.body,
      'address',
      'total',
      'paymentMethod',
      'idUser',
      'shipper',
      'idPromotion',
      'status'
    );
    const order = await Order.create(objOrder);
    req.order = order;

    console.log('req.order', req.order);
    let arrayItems = [];
    if (req.order.idPromotion !== null) {
      const promotion = await Promotion.find(req.order.idPromotion);
      req.idPromotion = promotion;
    }
    let totalQuality = 0;

    if (order._id) {
      await req.body.cart.map(async (item, index) => {
        let product = await Product.findById(item.productId);
        if (product) {
          if (order.paymentMethod.resultCode == 1006) {
            let itemProduct = {
              quantity: item.quantity,
              price: product.price,
              total: item.quantity * product.price,
              idColor: item.idColor,
              idSize: item.idSize,
              idOrder: order._id,
              idProduct: product._id,
              productImage: item.cover,
            };
            arrayItems.push(itemProduct);
          } else {
            totalQuality += item.quantity;
            product.soldQuality += totalQuality;
            await product.save();

            let idColorAndSize = await ProductDetail.find({
              idColor: item.idColor,
              idSize: item.idSize,
            });
            if (idColorAndSize) {
              idColorAndSize[0].quantity -= item.quantity;

              await idColorAndSize[0].save();
            } else {
              return next(new AppError('Không tồn tại quyển sách nào!', 404));
            }

            let itemProduct = {
              quantity: item.quantity,
              price: product.price,
              total: item.quantity * product.price,
              idColor: item.idColor,
              idSize: item.idSize,
              idOrder: order._id,
              idProduct: product._id,
              productImage: item.cover,
            };
            arrayItems.push(itemProduct);
          }
        } else {
          return next(new AppError('Không tồn tại sản phảm nào!', 404));
        }
        if (arrayItems.length === req.body.cart.length) {
          await OrderDetail.insertMany(arrayItems);
        }
      });

      res.status(201).json({
        status: 'success',
        result: order.length,
        data: order,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const _id = req.params.id;
  if (req.body.status === 'Đã hủy') {
    let doc = await Order.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    const orderDetail = await OrderDetail.find({ idOrder: _id });
    if (orderDetail) {
      await orderDetail.map(async (item) => {
        let idColorAndSize = await ProductDetail.find({
          idColor: item.idColor,
          idSize: item.idSize,
        });
        if (idColorAndSize) {
          idColorAndSize[0].quantity += item.quantity;

          await idColorAndSize[0].save();
        }
      });
    }

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  } else if (req.body.status === 'Đã giao hàng') {
    const doc = await Order.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  } else {
    const doc = await Order.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  }
});

exports.monthlyProductRevenue = catchAsync(async (req, res, next) => {
  // let a = { status: 'Đã nhận' };
  let idProduct = req.params.id;
  let doc = await OrderDetail.find({ idProduct });

  doc = doc.filter(
    (item) =>
      item.idOrder.status === 'Đã nhận' || item.idOrder.status === 'Đã đánh giá'
  );
  let result = _(doc)
    .groupBy((x) => moment(x.createdAt).format('DD-MM-YYYY'))
    .map((value, key) => ({ nameYear: key, orderRevenueDay: value }))
    .value();

  let array = _(result)
    .groupBy((x) => moment(x.orderRevenueDay[0].createdAt).format('MM-YYYY'))
    .map((value, key) => ({
      name: key,
      orderRevenueMonth: value,
    }))
    .value();

  // lấy ra tháng hiện tại để filter
  const currentDate = moment();
  const formattedDate = currentDate.format('MM-YYYY');

  array = array.filter((item) => item.name === formattedDate);

  const arrayMonth = [];
  const totalQuality = [];
  const totalPrice = [];

  array.forEach((month) => {
    month.orderRevenueMonth.forEach((order) => {
      arrayMonth.push(order.nameYear);
      let quality = 0;
      let price = 0;
      order.orderRevenueDay.forEach((day) => {
        quality += day.quantity;
        price += day.idOrder.total;
      });
      totalQuality.push(quality);
      totalPrice.push(price);
    });
  });

  res.status(200).json({
    status: 'success',
    result: arrayMonth.length,
    arrayMonth,
    totalQuality,
    totalPrice,
  });
});

exports.yearlyProductRevenue = catchAsync(async (req, res, next) => {
  let idProduct = req.params.id;
  let doc = await OrderDetail.find({ idProduct });
  doc = doc.filter(
    (item) =>
      item.idOrder.status === 'Đã nhận' || item.idOrder.status === 'Đã đánh giá'
  );
  let result = _(doc)
    .groupBy((x) => moment(x.createdAt).format('MM-YYYY'))
    .map((value, key) => ({ nameYear: key, orderRevenueDay: value }))
    .value();

  let array = _(result)
    .groupBy((x) => moment(x.orderRevenueDay[0].createdAt).format('MM-YYYY'))
    .map((value, key) => ({
      // name: moment(new Date(key)).format('MM'),
      name: key,
      orderRevenueMonth: value,
    }))
    .value();

  const arrayMonth = [];
  const totalQuality = [];
  const totalPrice = [];

  array.forEach((month) => {
    month.orderRevenueMonth.forEach((order) => {
      arrayMonth.push(order.nameYear);
      let quality = 0;
      let price = 0;
      order.orderRevenueDay.forEach((day) => {
        quality += day.quantity;
        price += day.idOrder.total;
      });
      totalQuality.push(quality);
      totalPrice.push(price);
    });
  });

  res.status(200).json({
    status: 'success',
    result: arrayMonth.length,
    arrayMonth,
    totalQuality,
    totalPrice,
  });
});

exports.getNotifications = catchAsync(async (req, res, next) => {
  let doc = await Order.find({ status: 'Đang xử lí' }).sort({ createdAt: -1 });

  let filteredDoc = doc.map(
    ({ idUser, _id, total, createdAt, isRead, status }) => ({
      idUser: { displayName: idUser.displayName, photoURL: idUser.photoURL },
      _id,
      total,
      createdAt: moment(createdAt).format('HH:mm DD-MM-YY'),
      isRead,
      status,
    })
  );

  res.status(200).json({
    status: 'success',
    result: filteredDoc.slice(0, 5).length,
    data: filteredDoc.slice(0, 5),
  });
});
