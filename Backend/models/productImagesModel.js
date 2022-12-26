const mongoose = require('mongoose');
const productImagesSchema = new mongoose.Schema(
  {
    url: {
      type: Array,
      required: [true, 'Please tell us url'],
      trim: true,
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
const productImages = mongoose.model('productImages', productImagesSchema);

module.exports = productImages;
