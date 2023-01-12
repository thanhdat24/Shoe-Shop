const mongoose = require('mongoose');

const orderDetailModelSchema = new mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    idSize: {
      type: mongoose.Schema.ObjectId,
      ref: 'Size',
    },
    idColor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Color',
    },
    idOrder: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
    },
    idProduct: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
    productImage: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderDetailModelSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idProduct',
  })
    .populate({
      path: 'idOrder',
    })
    .populate({
      path: 'idColor',
    })
    .populate({
      path: 'idSize',
    });

  next();
});

const OrderDetail = mongoose.model('OrderDetail', orderDetailModelSchema);
module.exports = OrderDetail;
