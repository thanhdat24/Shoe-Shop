const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    idAdmin: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
    idSupplier: { type: mongoose.Schema.ObjectId, ref: 'Supplier' },

    inventoryStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
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
    path: 'idSupplier',
    select: 'name phoneNumber fullAddress',
  }).populate({
    path: 'idAdmin',
    select: 'fullName phoneNumber',
  });

  next();
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
