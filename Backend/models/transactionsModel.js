const mongoose = require('mongoose');
const { paymentModelSchema } = require('./paymentModel');

const transactionsSchema = new mongoose.Schema(
  {
    casNumber: { type: String, required: true },
    reasonName: {
      type: String,
      required: true,
      default: 'Chi tiền trả NCC',
    },
    receiptId: { type: mongoose.Schema.ObjectId, ref: 'Receipt' },
    totalDebt: { type: Number, required: true },
    amount: { type: Number, required: true },
    tranDate: { type: Date },
    paymentMethod: paymentModelSchema,
    paidBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

transactionsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'paidBy',
    select: 'displayName phoneNumber email',
  }).populate({ path: 'receiptId' });

  next();
});

const Transactions = mongoose.model('Transactions', transactionsSchema);

module.exports = Transactions;
