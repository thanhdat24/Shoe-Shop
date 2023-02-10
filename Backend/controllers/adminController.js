const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const factory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const mkdirp = require('mkdirp');
const cloudinary = require('../utils/cloudinary');

exports.getAllAdmins = factory.getAll(Admin);
exports.createAdmin = factory.createOne(Admin);
exports.updateAdmin = factory.updateOne(Admin);
exports.deleteAdmin = factory.deleteOne(Admin);
exports.getDetailAdmin = factory.getOne(Admin);
exports.getDetail = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    length: 1,
    data: req.params.user,
  });
});

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
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

exports.uploadUserPhoto = upload.single('photoURL');

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const accessToken = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', accessToken, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    user,
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not fro password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 2) Update user document
  // Get filtered name and email
  const filteredBody = filterObj(
    req.body,
    'displayName',
    'phoneNumber',
    'gender',
    'dateOfBirth',
    'photoURL',
    'address'
  );
  console.log('filteredBody ', filteredBody);
  if (filteredBody.photoURL) {
    const uploadedResponse = await cloudinary.uploader.upload(
      filteredBody.photoURL,
      {
        upload_preset: 'avatar',
      }
    );
    filteredBody.photoURL = uploadedResponse.secure_url;
  }

  //multer
  // const path = req.file?.path.replace(/\\/g, '/').substring('public'.length);
  // const urlImage = `http://localhost:8080${path}`;

  const user = await Admin.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  createSendToken(user, 200, res);
});

exports.getAllAccounts = catchAsync(async (req, res, next) => {
  let queryAdmin = Admin.find(req.query);
  const admin = await queryAdmin;

  let queryUser = User.find(req.query);
  const resultUser = await queryUser;

  resultUser.map((item) => {
    admin.push(item);
  });

  res.status(200).json({
    status: 'success',
    result: admin.length,
    data: admin,
  });
});
