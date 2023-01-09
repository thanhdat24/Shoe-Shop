const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      // required: [true, 'Please tell us your quantity'],
    },
    sku: {
      type: String,
      // required: [true, 'Please tell us your sku'],
    },
    idProduct: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
    idSize: {
      type: mongoose.Schema.ObjectId,
      ref: 'Size',
    },
    idColor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Color',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productDetailSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idProduct',
  })
    .populate({
      path: 'idSize',
    })
    .populate({
      path: 'idColor',
    });

  next();
});

const ProductDetail = mongoose.model('ProductDetail', productDetailSchema);

module.exports = ProductDetail;
