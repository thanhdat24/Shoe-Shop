const mongoose = require('mongoose');

const receiptDetailSchema = new mongoose.Schema(
  {
    quantity: { type: Number,  },
    price: { type: Number,  },
    totalPrice: {
      type: Number,
    },
    idReceipt: {
      type: mongoose.Schema.ObjectId,
      ref: 'Receipt',
    },
    idProduct: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
    idProductDetail: { type: mongoose.Schema.ObjectId, ref: 'ProductDetail' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

receiptDetailSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idProduct',
  })
    .populate({
      path: 'idProductDetail',
    })
    .populate({
      path: 'idReceipt',
    });

  next();
});

const ReceiptDetail = mongoose.model('ReceiptDetail', receiptDetailSchema);

module.exports = ReceiptDetail;
