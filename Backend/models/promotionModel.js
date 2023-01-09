const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A promotion must have a title'],
    },
    price: {
      type: Number,
      required: [true, 'A promotion must have a price'],
    },
    percent: {
      type: String,
    },
    miniPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      required: [true, 'A promotion must have a code'],
    },
    startDate: {
      type: Date,
      required: [true, 'A promotion must have a startDate'],
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'A promotion must have a expiryDate'],
      trim: true,
    },
    activePublic: {
      type: Boolean,
      default: false,
    },
    activeCode: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Promotion = mongoose.model('Promotion', promotionSchema);
module.exports = Promotion;
