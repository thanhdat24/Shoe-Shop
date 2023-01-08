const mongoose = require('mongoose');
const { paymentModelSchema } = require('./paymentModel');

const orderModelSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      displayName: {
        type: String,
        required: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      district: {
        type: String,
        required: true,
        trim: true,
      },
      ward: {
        type: String,
        required: true,
        trim: true,
      },
      isDefault: {
        type: Boolean,
        default: true,
      },
    },
    receiveDay: { type: Date },
    status: {
      type: String,
      default: 'Đang xử lý',
    },
    paymentMethod: paymentModelSchema,
    idAdmin: {
      type: mongoose.Schema.ObjectId,
      ref: 'Admin',
    },
    idPromotion: {
      type: mongoose.Schema.ObjectId,
      ref: 'Promotion',
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    // },
    // shipper: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Shipper',
    // },
    // isSeen: {
    //   type: Boolean,
    //   default: false,
    // },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// orderSchema.virtual('orderDetail', {
//   ref: 'OrderDetail',
//   foreignField: 'order',
//   localField: '_id',
// });

orderModelSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idAdmin',
    select: 'displayName phoneNumber email avatar',
  }).populate({
    path: 'idPromotion',
  });

  next();
});

const Order = mongoose.model('Order', orderModelSchema);
module.exports = Order;
