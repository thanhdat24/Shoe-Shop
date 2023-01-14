const mongoose = require('mongoose');
const { paymentModelSchema } = require('./paymentModel');

const orderModelSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    address: {
      fullName: {
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
      fullAddress: {
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
    idShipper: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shipper',
    },
    receiveDay: { type: Date },
    status: {
      type: String,
      default: 'Đang xử lý',
    },
    paymentMethod: paymentModelSchema,
    idUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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

orderModelSchema.virtual('orderDetail', {
  ref: 'OrderDetail',
  foreignField: 'idOrder',
  localField: '_id',
});

orderModelSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idUser',
  })
    .populate({
      path: 'idPromotion',
    })
    .populate({
      path: 'idShipper',
    });

  next();
});

const Order = mongoose.model('Order', orderModelSchema);
module.exports = Order;
