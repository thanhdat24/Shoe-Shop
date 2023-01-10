const mongoose = require('mongoose');

const addressModelSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: true,
    },
    addressType: {
      type: String,
      required: true,
      trim: true,
    },
    idUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

addressModelSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idUser',
  });

  next();
});

const Address = mongoose.model('Address', addressModelSchema);
module.exports = Address;
