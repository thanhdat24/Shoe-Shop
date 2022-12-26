const factory = require('./handlerFactory');
const Product = require('../models/productModel');
const ProductDetail = require('../models/productDetailModel');
const ProductImages = require('../models/productImagesModel');
const catchAsync = require('../utils/catchAsync');
const _ = require('lodash');

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getDetailProduct = factory.getOne();
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.getAllProduct = factory.getAll(Product, { path: 'productDetail' });

// exports.createProduct = factory.createOne(Product);
exports.createProduct = catchAsync(async (req, res, next) => {
  console.log('req.body', req.body);
  let productItems = [];
  let productImages = { url: [], idProduct: '' };
  req.body.map((item, index) => {
    item.sku = item.sku + `-${index + 1}`;
    productItems.push({
      idSize: item.idSize,
      idColor: item.idColor,
      quality: item.quality,
      idProduct: '',
    });
  });

  const doc = await Product.create(req.body[0]);
  if (doc) {
    productItems.map((item, index) => {
      item.idProduct = doc.id;
    });

    productImages = {
      ...productImages,
      url: req.body[0].productImages,
      idProduct: doc.id,
    };
  }
  await ProductDetail.insertMany(productItems);
  await ProductImages.create(productImages);

  res.status(201).json({
    status: 'success',
    result: doc.length,
    data: doc,
  });
});
