const mongoose = require('mongoose');
const { messageSchema } = require('./messageModel');

const chatSchema = new mongoose.Schema(
  {
    messages: [messageSchema],
    participants: [
      {
        type: mongoose.Schema.Types.Mixed,
        refPath: 'participantType',
      },
    ],
    participantType: {
      type: Array,
      required: true,
    },

    type: {
      type: String,
      enum: ['ONE_TO_ONE', 'GROUP'],
      default: 'ONE_TO_ONE',
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'participants',
  });
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
