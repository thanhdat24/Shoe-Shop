const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Product = require('../models/productModel');
const ProductDetail = require('../models/productDetailModel');
const ProductImages = require('../models/productImagesModel');
const Promotion = require('../models/promotionModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllOrder = factory.getAll(Order, { path: 'orderDetail' });
// exports.getDetailOrder = factory.getOne(Order, { path: 'orderDetail' });

exports.getDetailOrder = catchAsync(async (req, res, next) => {
  let query = Order.findById(req.params.id).populate('orderDetail');
  // if (populateOptions) query = query.populate(populateOptions);
  const doc = await query;
  let productImages = [];

  let queryProductImages = await ProductImages.find({
    idProduct: doc.orderDetail[0].idProduct.id,
  }).populate('productDetail queryProductImages');

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  if (queryProductImages) {
    queryProductImages[0].url.map((item) => {
      productImages.push(item);
    });
  }
  res.status(200).json({
    status: 'success',
    length: 1,
    data: doc,
    productImages,
  });
});

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
