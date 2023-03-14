const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const gravatarUrl = require('gravatar');
const Admin = require('../models/adminModel');
const Shipper = require('../models/shipperModel');
const User = require('../models/userModel');

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

exports.signup = catchAsync(async (req, res, next) => {
  // create avatar default
  const avatarUrl = gravatarUrl.url(req.body.email, {
    protocol: 'http',
    s: '100',
  });

  const newAdmin = await Admin.create({
    displayName: req.body.displayName,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    idRole: req.body.idRole,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    photoURL: avatarUrl,
    address: req.body.address,
  });

  createSendToken(newAdmin, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) Check if user exists && password is correct
  const admin = await Admin.findOne({ email }).select('+password');
  // console.log("email", email)
  console.log('password', password);
  console.log('admin', admin);

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Email hoặc mật khẩu không chính xác!', 401));
  }
  // 3) If everything ok, send token to client
  createSendToken(admin, 200, res);
});

exports.getMe = (req, res, next) => {
  req.params.user = req.user;
  // console.log('req.params.id', req.params.id);
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
  const currentUserAdmin = await Admin.findById(decoded.id);
  const currentUserShipper = await Shipper.findById(decoded.id);
  // if (!currentUserAdmin) {
  //   return next(
  //     new AppError(
  //       'The user belonging to this accessToken  does no longer exist',
  //       401
  //     )
  //   );
  // }
  if (currentUserAdmin) {
    req.user = currentUserAdmin;
  } else {
    req.user = currentUserShipper;
  }
  // 4) Check if user changed password after the accessToken  was issued

  // GRANT ACCESS TO PROTECTED ROUTER
  next();
});

let firebaseApp = null;
exports.protectUser = catchAsync(async (req, res, next) => {
  var admin = require('firebase-admin');

  var serviceAccount = require('../shoes-firebase.json');

  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

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
  } else {
    const { getAuth } = require('firebase-admin/auth');
    getAuth()
      .verifyIdToken(accessToken)
      .then(async (decodedToken) => {
        const uid = decodedToken.uid;

        const currentUser = await User.find({ googleId: uid });

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
        req.user = currentUser[0];
        next();
        // ...
      })
      .catch((error) => {
        // Handle error
      });
  }
});


exports.sendOtp = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTED email
  let OTP = generator.generate({
    length: 6,
    numbers: true,
    uppercase: false,
    lowercase: false,
  });
  console.log('OTP', OTP);
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    let newOtp = new Otp({
      email: req.body.email,
      otp: OTP,
    });
    await newOtp.save();
  } else {
    return next(new AppError('Xác thực người dùng không thành công.', 404));
  }

  // 2) Generate the random reset token
  // const resetToken = user.createPasswordResetToken();
  // await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email

  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/users/resetPassword/${resetToken}`;

  const message = /*html*/ `<div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;width:100%!important;height:100%;line-height:1.6em;background-color:#f6f6f6;margin:0"
        bgcolor="#f6f6f6">

        <table
            style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;width:100%;background-color:#f6f6f6;margin:0"
            bgcolor="#f6f6f6">
            <tbody>
                <tr
                    style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                    <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;margin:0"
                        valign="top"></td>
                    <td class="m_-5009379243298609813container" width="600"
                        style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;display:block!important;max-width:600px!important;clear:both!important;margin:0 auto"
                        valign="top">
                        <div class="m_-5009379243298609813content"
                            style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;max-width:600px;display:block;margin:0 auto;padding:20px">
                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;border-radius:3px;background-color:#fff;margin:0;border:1px solid #e9e9e9"
                                bgcolor="#fff">
                                <tbody>
                                    <tr
                                        style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                        <td class="m_-5009379243298609813content-wrap"
                                            style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;margin:0;padding:20px"
                                            valign="top">
                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                                <tbody>
                                                    <tr
                                                        style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                                        <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;margin:0;padding:0 0 20px"
                                                            valign="top">
                                                            Chào bạn.
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                                        <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;margin:0;padding:0 0 20px"
                                                            valign="top">
                                                            Sau đây là mã xác minh để đặt lại mật khẩu của bạn.
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                                        <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;margin:0;padding:0 0 20px"
                                                            valign="top">
                                                            <a
                                                                style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;color:#fff;text-decoration:none;line-height:2em;font-weight:bold;text-align:center;display:inline-block;border-radius:5px;text-transform:capitalize;background-color:#5fbeaa;margin:0;border-color:#5fbeaa;border-style:solid;border-width:10px 20px"><span
                                                                    style="text-transform:lowercase">${OTP}</span></a>
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                                        <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;margin:0;padding:0 0 20px"
                                                            valign="top">
                                                            © 2022 • <a href="#" target="_blank"
                                                                data-saferedirecturl="https://www.google.com/url?q=http://CARDVIP.VN&amp;source=gmail&amp;ust=1656782912157000&amp;usg=AOvVaw2W6rUidHZUy1Pqp-vi7QmP">MovieApp</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                    <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;margin:0"
                        valign="top"></td>
                </tr>
            </tbody>
        </table>
        <div class="yj6qo"></div>
        <div class="adL">
        </div>
    </div>`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Mã xác minh để đặt lại mật khẩu MovieApp của bạn',
      message,
    });

    res.status(200).json({
      status: 'success',
      email: user.email,
      message:
        'Đổi mật khẩu thành công. Vui lòng kiểm tra hộp thư hoặc spam để kích hoạt tài khoản',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500
      )
    );
  }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  let otp = await Otp.findOne({ email: req.body.email, otp: req.body.otp });
  if (otp) {
    // let currentTime = new Date().getTime();
    // let diff = otp.expiryIn.getTime() - currentTime;
    // console.log('currentTime', currentTime);
    // console.log('diff', diff);
    // if (diff < 0) {
    //   return next(new AppError('Token hết hạn.', 404));
    // }
    //  else {
    const user = await User.findOne({ email: req.body.email }).select(
      '+password'
    );

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    // }

    res.status(200).json({
      status: 'success',
      user,
    });
  } else {
    return next(new AppError('Otp không hợp lệ hoặc đã hết hạn!', 404));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await Admin.findById(req.user.id).select('+password');
  // 2) Check if POSTED current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError('Mật khẩu hiện tại của bạn không chính xác.', 401)
    );
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send  JWT
  createSendToken(user, 200, res);
});
