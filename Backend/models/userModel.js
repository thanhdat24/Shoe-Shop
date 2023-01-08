const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      // required: [true, 'Please tell us your displayName'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      allowNull: true,
    },
    gender: {
      type: String,
      // required: [true, 'Please tell us your gender'],
      // enum: ['Nam', 'Nữ'],
      allowNull: true,
    },
    email: {
      type: String,
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
    googleId: {
      type: String,
      allowNull: true,
    },
    role: {
      type: String,
      default: 'Khách hàng',
    },
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
