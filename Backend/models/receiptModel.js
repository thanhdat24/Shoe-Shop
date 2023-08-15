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
