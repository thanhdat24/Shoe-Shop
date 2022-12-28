const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please tell us your fullName'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      allowNull: true,
    },
    gender: {
      type: String,
      required: [true, 'Please tell us your gender'],
      // enum: ['Nam', 'Nữ'],
      allowNull: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      // unique: true,
      // chuyển về chữ thường
      lowercase: true,
      // check email
    },
    dateOfBirth: {
      type: Date,
      allowNull: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: 'Customer',
    },
    address: {
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
  },
  { timestamps: true }
);

userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
module.exports = User;
