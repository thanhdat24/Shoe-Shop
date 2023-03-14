const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
    },
    attachments: {
      type: Array,
      default: [],
    },
    contentType: {
      type: String,
      enum: ['text', 'image'],
    },
    senderId: {
      type: String,
    },
    senderFullName: {
      type: String,
    },
    senderEmail: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message, messageSchema };
