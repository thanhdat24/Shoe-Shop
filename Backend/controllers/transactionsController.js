const factory = require('./handlerFactory');
const Transactions = require('../models/transactionsModel');
const catchAsync = require('../utils/catchAsync');

exports.getDetailTransactions = factory.getOne(Transactions);
exports.updateTransactions = factory.updateOne(Transactions);
exports.deleteTransactions = factory.deleteOne(Transactions);
exports.getAllTransactions = factory.getAll(Transactions);

exports.getAllTransactionsByReceiptId = catchAsync(async (req, res, next) => {
  console.log('req.params.id', req.params.id);
  const transactions = await Transactions.find({ receiptId: req.params.id });

  if (!transactions) {
    return next(new AppError('Không tìm thấy mã phiếu nhập', 404));
  }

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions,
    },
  });
});
