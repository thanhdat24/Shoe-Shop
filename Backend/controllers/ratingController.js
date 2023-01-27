const Rating = require('../models/ratingModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const Order = require('../models/orderModel');

exports.getAllRating = factory.getAll(Rating);
exports.getDetailRating = factory.getOne(Rating);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/img/ratings');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `book-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Không phải hình ảnh! Vui lòng tải file hình ảnh.', 400),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadImageRating = upload.fields([
  { name: 'imageRating', maxCount: 4 },
]);

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createRating = catchAsync(async (req, res, next) => {
  let arrayItems = [];
  const itemNoImage = [];
  let count = 0;
  await Order.findByIdAndUpdate(req.body[0].idOrder, {
    status: 'Đã đánh giá',
  });
  req.body.map(async (item) => {
    if (item.imageRating.length > 0) {
      //imageRating base64
      item.imageRating.map(async (image) => {
        const uploadedResponse = await cloudinary.uploader.upload(image, {
          upload_preset: 'image_rating',
        });
        let product = {
          idProduct: item.idProduct,
          imageRating: [uploadedResponse.secure_url],
          idOrder: item.idOrder,
          content: item.content,
          rating: item.rating,
        };

        let index = arrayItems.findIndex(
          (item2) => item2.idProduct === item.idProduct
        );
        if (index !== -1) {
          arrayItems[index].imageRating = [
            ...arrayItems[index].imageRating,
            uploadedResponse.secure_url,
          ];
          count++;
        } else {
          arrayItems.push(product);
          count++;
        }
        let res = req.body.reduce((total, item3) => {
          return (total += item3.imageRating.length);
        }, 0);
        let a = [];
        if (res === count) {
          arrayItems.map((item3) => {
            item.imageRating = item3.imageRating;
            a.push(item3);
          });
        }
        a.map((item4) => {
          item.imageRating = item4.imageRating;
        });
        await Rating.insertMany(a);
      });
    } else {
      itemNoImage.push(item);
      await Rating.create(item);
    }
  });
  res.status(201).json({
    status: 'success',
    result: req.body.length,
    data: req.body,
  });
});
exports.updateRating = factory.updateOne(Rating);
// exports.getProductRating = catchAsync(async (req, res, next) => {
//   console.log('req.params', req.params);
//   const { id } = req.params;

//   const doc = await Rating.find({ idProduct: id }).sort({ createdAt: -1 });

//   if (!doc) {
//     return next(new AppError('No document found with that ID', 404));
//   }

//   res.status(201).json({
//     status: 'success',
//     result: doc.length,
//     data: doc,
//   });
// });

exports.getProductRating = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let query = Rating.find().populate('idOrder idProduct');
  const doc = await query;

  let filterDoc = doc.filter((item) => item.idProduct.id === id);

  res.status(200).json({
    status: 'success',
    length: filterDoc.length,
    data: filterDoc,
  });
});

exports.likeRating = factory.updateOne(Rating);
exports.deleteRating = factory.deleteOne(Rating);
