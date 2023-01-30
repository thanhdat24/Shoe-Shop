const Promotion = require('../models/promotionModel');
const moment = require('moment');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllPromotion = catchAsync(async (req, res, next) => {
  try {
    let query = Promotion.find().sort({ activeCode: -1 });
    let result = await query;
    let currentDay = moment().format('YYYY-MM-DDTHH:mm:SS');
    result.map(async (day) => {
      if (
        moment(day.startDate).format('YYYY-MM-DDTHH:mm:SS') > currentDay &&
        moment(day.expiryDate).format('YYYY-MM-DDTHH:mm:SS') > currentDay &&
        day.activeCode !== 'Kết thúc'
      ) {
        day.activeCode = 'Sắp diễn ra';
        await Promotion.findByIdAndUpdate(day._id, {
          activeCode: 'Sắp diễn ra',
        });
      } else if (
        moment(day.startDate).format('YYYY-MM-DDTHH:mm:SS') < currentDay &&
        moment(day.expiryDate).format('YYYY-MM-DDTHH:mm:SS') > currentDay &&
        day.activeCode !== 'Kết thúc'
      ) {
        day.activeCode = 'Đang diễn ra';
        await Promotion.findByIdAndUpdate(day._id, {
          activeCode: 'Đang diễn ra',
        });
      } else {
        day.activeCode = 'Kết thúc';
        await Promotion.findByIdAndUpdate(day._id, {
          activeCode: 'Kết thúc',
        });
      }
    });

    res.status(200).json({
      status: 'success',
      data: result,
      result: result.length,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// exports.getAllPromotion = factory.getAll(Promotion);
exports.createPromotion = factory.createOne(Promotion);
exports.getDetailPromotion = factory.getOne(Promotion);
exports.updatePromotion = factory.updateOne(Promotion);
exports.deletePromotion = factory.deleteOne(Promotion);
