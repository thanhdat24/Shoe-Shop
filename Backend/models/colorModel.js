const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  color: {
    type: String,
    required: [true, 'Please tell us your color'],
    trim: true,
  },
});


const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
