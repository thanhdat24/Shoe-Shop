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

exports.getDetailProduct = factory.getOne(Product, {
  path: 'productDetail productImages',
});
exports.getDetailProductByName = factory.getOneByName(Product, {
  path: 'productDetail productImages',
});

exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
// exports.getAllProduct = catchAsync(async (req, res, next) => {
//   let query = Product.find(req.query).populate('productDetail productImages');
//   const doc = await query;
//   // console.log('doc', doc.productDetail);
//   res.status(200).json({
//     status: 'success',
//     result: doc.length,
//     data: doc,
//   });
// });
exports.getAllProduct = factory.getAll(Product, {
  path: 'productDetail productImages',
});

// exports.createProduct = factory.createOne(Product);
exports.createProduct = catchAsync(async (req, res, next) => {
  console.log('req.body', req.body);
  let productItems = [];
  let productImages = { url: [], idProduct: '' };
  req.body.map((item, index) => {
    productItems.push({
      idSize: item.size._id,
      idColor: item.color._id,
      quantity: item.quantity,
      sku: item.sku,
      idProduct: '',
    });
  });
  // let newProduct = new Product({
  //   name:req.body[0].name,
  //   desc: req.body[0].desc,
  //   priceSale: req.body[0].priceSale,
  //   price: req.body[0].price,
  //   sku:  req.body[0].sku,
  //   origin: req.body[0].origin ,
  //   supplier: req.body[0].supplier ,
  //   style:req.body[0].style, ,
  //   material: req.body[0].material, ,
  //   idCate: req.body[0].name, ,
  //   idBrand:  req.body[0].name,,
  //   idObjectUse: req.body[0].name, ,
  // });
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
  // await ProductDetail.insertMany(productItems);
  // await ProductImages.create(productImages);

  res.status(201).json({
    status: 'success',
    result: doc.length,
    data: doc,
  });
});
