const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us category'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please tell us phone number'],
    },
    fullAddress: {
      type: String,
      required: [true, 'Please tell us address'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Supplier = mongoose.model('Supplier', supplierSchema);


module.exports = Supplier;
