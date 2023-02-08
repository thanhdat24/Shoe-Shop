const mongoose = require('mongoose');
const productImagesSchema = new mongoose.Schema(
  {
    url: {
      type: Array,
      required: [true, 'Please tell us url'],
      trim: true,
    },
    cover: {
      type: String,
    },
    idProduct: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productImagesSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idProduct',
  });

  next();
});
const ProductImages = mongoose.model('ProductImages', productImagesSchema);

module.exports = ProductImages;
