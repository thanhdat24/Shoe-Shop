const mongoose = require('mongoose');
const productImagesSchema = new mongoose.Schema(
  {
    url: {
      type: Array,
      required: [true, 'Please tell us url'],
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const productImages = mongoose.model('productImages', productImagesSchema);

module.exports = productImages;
