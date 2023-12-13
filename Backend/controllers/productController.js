const factory = require('./handlerFactory');
const Product = require('../models/productModel');
const ProductDetail = require('../models/productDetailModel');
const ProductImages = require('../models/productImagesModel');
const catchAsync = require('../utils/catchAsync');
const _ = require('lodash');
const cloudinary = require('../utils/cloudinary');
const fullTextSearch = require('fulltextsearch');
const slug = require('slug');

const fullTextSearchVi = fullTextSearch.vi;

exports.getDetailProduct = factory.getOne(Product, {
  path: 'productDetail productImages',
});
exports.getDetailProductByName = factory.getOneByName(Product, {
  path: 'productDetail productImages',
});

exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const skip = (page - 1) * limit;

  const count = await Product.countDocuments();
  const totalPages = Math.ceil(count / limit);
  let query;
  if (req.query.page !== 'undefined') {
    query = Product.find()
      .sort({ createdAt: -1 })
      .populate('productDetail productImages')
      .skip(skip)
      .limit(limit);
  } else {
    query = Product.find()
      .sort({ createdAt: -1 })
      .populate('productDetail productImages');
  }

  const doc = await query;

  res.status(200).json({
    status: 'success',
    result: doc.length,
    page,
    totalPages,
    data: doc,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { productImages } = req.body[0];
  let productItems = [];
  req.body.map((item, index) => {
    productItems.push({
      idSize: item.idSize._id,
      idColor: item.idColor._id,
      quantity: item.quantity,
      sku: item.sku,
      idProduct: '',
      urlImage: '',
    });
  });

  const doc = await Product.create(req.body[0]);
  let arrayImages = [];
  let newImages = { url: [], idProduct: '' };
  if (productImages.length > 0) {
    productImages.map(async (item) => {
      const uploadedResponse = await cloudinary.uploader.upload(item, {
        upload_preset: 'image_product',
      });
      arrayImages.push(uploadedResponse.secure_url);
      if (arrayImages.length === productImages.length) {
        if (doc) {
          productItems.map((item, index) => {
            item.idProduct = doc.id;
            item.urlImage = arrayImages[index];
          });
          newImages = {
            ...newImages,
            url: arrayImages,
            idProduct: doc.id,
          };

          await Product.findByIdAndUpdate(doc.id, { urlImage: arrayImages[0] });
          await ProductDetail.insertMany(productItems);
          await ProductImages.create(newImages);

          res.status(201).json({
            status: 'success',
            result: doc.length,
            data: doc,
          });
        }
      }
    });
  }
});

exports.searchProduct = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page);
  const limit = 6;
  const skip = (page - 1) * limit;

  const count = await Product.countDocuments();
  let { search } = req.query;
  search = search.replace(/\.$/, '');
  var filter = {};
  if (search != '') {
    filter.name = new RegExp(fullTextSearchVi(search), 'i');
  }
  await Product.find(filter)
    .populate('productImages productDetail')
    .then((records) => {
      res.status(200).json({
        status: 'success',
        result: records.length,
        data: records,
      });
    });
});

exports.searchGender = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  const product = await Product.find().populate('productImages productDetail');

  const newProduct = product.filter((item) => item.idObjectUse.name === search);

  res.status(200).json({
    status: 'success',
    result: newProduct.length,
    data: newProduct,
  });
});

exports.bestSellerProduct = catchAsync(async (req, res, next) => {
  let products = await Product.find().populate('productDetail productImages');
  products.sort((a, b) => b.soldQuality - a.soldQuality);

  let top3 = products.slice(0, 3);

  res.status(200).json({
    status: 'success',
    result: top3.length,
    data: top3,
  });
});
