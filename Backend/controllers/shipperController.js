const factory = require('./handlerFactory');
const Shipper = require('../models/shipperModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.getDetailShipper = factory.getOne();
exports.updateShipper = factory.updateOne(Shipper);
exports.deleteShipper = factory.deleteOne(Shipper);
exports.createShipper = factory.createOne(Shipper);
exports.getAllShipper = factory.getAll(Shipper);

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) Check if user exists && password is correct
  const admin = await Shipper.findOne({ email }).select('+password');
  // console.log("email", email)

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Email hoặc mật khẩu không chính xác!', 401));
  }
  // 3) If everything ok, send token to client
  createSendToken(admin, 200, res);
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    accessToken = req.headers.authorization.split(' ')[1];
  }
  if (!accessToken) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verification accessToken
  const decoded = await promisify(jwt.verify)(
    accessToken,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists
  const currentUser = await Admin.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this accessToken  does no longer exist',
        401
      )
    );
  }
  // 4) Check if user changed password after the accessToken  was issued

  // GRANT ACCESS TO PROTECTED ROUTER
  req.user = currentUser;
  next();
});
