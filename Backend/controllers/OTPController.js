const OTP = require('../models/OTPModel');
const factory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.getAllOTP = factory.getAll(OTP);
// exports.createOTP = factory.createOne(OTP);

const generateRandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.createOTP = catchAsync(async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    // Kiểm tra xem đã tồn tại một OTP với phoneNumber này chưa
    const existOTP = await OTP.findOne({ phoneNumber: Number(phoneNumber) });

    if (existOTP) {
      // Nếu đã tồn tại, bạn có thể gửi thông báo lỗi hoặc thực hiện hành động phù hợp
      return next(new AppError('Đã tồn tại mã OTP cho số điện thoại này', 400));
    }

    // Nếu chưa tồn tại, tạo một OTP mới và gửi nó
    const otpCode = generateRandomOTP();
    req.body = {
      ...req.body,
      code: otpCode,
    };

    // Tạo một bản ghi OTP mới
    factory.createOne(OTP)(req, res, next);
  } catch (error) {
    return next(new AppError(error, 401));
  }
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { phoneNumber, code } = req.body;

  // Kiểm tra xem mã OTP có chính xác không và user có tồn tại không
  let isValidOTP = await OTP.findOne({
    phoneNumber: Number(phoneNumber),
    code,
  });

  let existUser = await User.findOne({ phoneNumber: Number(phoneNumber) });

  if (isValidOTP && existUser) {
    // Nếu mã OTP chính xác và user tồn tại, tạo và gửi token
    await OTP.deleteOne({ phoneNumber: Number(phoneNumber), code });

    createSendToken(existUser, 200, res);
  } else if (isValidOTP && !existUser) {
    // Nếu mã OTP chính xác nhưng user không tồn tại, tạo user mới và gửi token
    await OTP.deleteOne({ phoneNumber: Number(phoneNumber), code });
    let newUser = await User.create({ phoneNumber: Number(phoneNumber) });
    createSendToken(newUser, 200, res);
  } else {
    // Nếu mã OTP không chính xác hoặc user không tồn tại, thông báo lỗi
    return next(new AppError('Mã OTP không chính xác', 404));
  }
});
