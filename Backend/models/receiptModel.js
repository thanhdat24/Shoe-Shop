const mongoose = require('mongoose');
const { paymentModelSchema } = require('./paymentModel');

const receiptSchema = new mongoose.Schema(
  {
    paymentHistory: [
      {
        casNumber: { type: String, required: true, unique: true },
        reasonName: {
          type: String,
          required: true,
          default: 'Chi tiền trả NCC',
        },
        totalDebt: { type: Number, required: true },
        amount: { type: Number, required: true },
        tranDate: { type: Date, required: true, default: Date.now() },
        paymentMethod: paymentModelSchema,
        paidBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
      },
    ],
    receiptCode: {
      type: String,
      required: true,
      unique: true,
    },
    totalPrice: {
      type: Number,
    },
    totalReceivedQuantity: {
      type: Number,
    },
    staffProcessor: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
    supplier: { type: mongoose.Schema.ObjectId, ref: 'Supplier' },
    receivingWarehouse: {
      warehouseAddress: { type: String, required: true },
      warehousePhoneNumber: { type: String, required: true },
    },
    supplierCost: {
      type: Number,
    },
    supplierPaidCost: {
      type: Number,
    },
    inventoryStatus: {
      type: Number,
      default: 2,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

receiptSchema.virtual('receiptDetail', {
  ref: 'ReceiptDetail',
  foreignField: 'idReceipt',
  localField: '_id',
});

receiptSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'supplier',
  })
    .populate({
      path: 'staffProcessor',
      select: 'displayName phoneNumber email',
    })
    .populate({
      path: 'paymentHistory.paidBy',
      select: 'displayName phoneNumber email',
    });

  next();
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
