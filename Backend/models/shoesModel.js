const mongoose = require('mongoose');

const shoesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,

      trim: true,
    },
    soldQuality: {
      type: Number,
      trim: true,
      default:0
    },
    sku: {
      type: String,
     
      default: Math.floor(10000 + Math.random() * 90000),
    },
    origin: {
      type: String,
      trim: true,
    },
    designs: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    idCate: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    idBrand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    idObjectUse: {
      type: mongoose.Schema.ObjectId,
      ref: 'ObjectUse',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Shoes = mongoose.model('Shoes', shoesSchema);

module.exports = Shoes;
