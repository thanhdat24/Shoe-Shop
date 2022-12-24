const mongoose = require('mongoose');

const ObjectUseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us ObjectUse'],
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ObjectUse = mongoose.model('ObjectUse', ObjectUseSchema);

module.exports = ObjectUse;
