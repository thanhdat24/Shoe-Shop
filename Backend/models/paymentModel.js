const mongoose = require('mongoose');

const paymentModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    resultCode: {
      type: Number,
    },
    orderId: {
      type: String,
    },
    image: {
      type: String,
    },
    transId: { type: String },
    message: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentModelSchema);
module.exports = { Payment, paymentModelSchema };
