const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  name: {
    type: Number,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
});

const Size = mongoose.model('Size', sizeSchema);

module.exports = Size;
