const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
var findOrCreate = require('mongoose-findorcreate');

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please tell us your fullName'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, 'Please provide your phoneNumber'],
      validate: {
        validator: function (number) {
          return /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
            number
          );
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      allowNull: true,
    },
    gender: {
      type: String,
      required: [true, 'Please tell us your gender'],
      enum: ['Nam', 'Nữ'],
      allowNull: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      // chuyển về chữ thường
      lowercase: true,
      // check email
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide your date of birth'],
      allowNull: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'nhân viên', 'khách hàng'],
      default: 'khách hàng',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      // Không tự hiện thị
      select: false,
      allowNull: true,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password; // abc === abc
        },
        messages: 'Password and Confirmation Password must match',
      },
      allowNull: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide your address'],
      allowNull: true,
    },
    googleId: {
      type: String,
      allowNull: true,
    },

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
    accessToken: String,
  },
  { timestamps: true }
);

adminSchema.plugin(findOrCreate);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
adminSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; // 100 < 200
  }

  // False means Not change

  return false;
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
