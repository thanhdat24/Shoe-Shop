const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    receiptCode: {
      type: String,
      required: true,
      unique: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalReceivedQuantity: {
      type: Number,
      required: true,
    },
    staffProcessor: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
    supplier: { type: mongoose.Schema.ObjectId, ref: 'Supplier' },
    receivingWarehouse: {
      warehouseAddress: { type: String, required: true },
      warehousePhoneNumber: { type: String, required: true },
    },
    debt : {
      type: Number,
      required: true,
    },
    inventoryStatus: {
      type: Boolean,
      default: true,
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
    path: 'supplier',
    select: 'name phoneNumber fullAddress',
  }).populate({
    path: 'staffProcessor',
    select: 'displayName phoneNumber email',
  });

  next();
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
