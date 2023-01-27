const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema(
  {
    idOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    likes: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
    },
    userLikeThisComment: [],
    imageRating: {
      type: Array,
    },
    active: {
      type: Boolean,
      default: false,
    },
    hidden: {
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

ratingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idOrder',
  }).populate({
    path: 'idProduct',
  });
  next();
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
