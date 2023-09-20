const express = require('express');

const receiptController = require('../controllers/receiptController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(receiptController.getAllReceipt);

router.post('/', authController.protect, receiptController.createReceipt);

router.patch('/update-receipt-draft/:id', receiptController.updateReceiptDraft);

router.get(
  '/:id/transactions',
  receiptController.getAllTransactionsByReceiptId
);


router.get('/:id/debts', receiptController.getAllDebtsReceipt);

router.patch(
  '/make-supplier-payment/:id',
  authController.protect,
  receiptController.makeSupplierPayment
);

router
  .route('/:id')
  .get(receiptController.getDetailReceipt)
  .patch(receiptController.updateReceipt)
  .delete(receiptController.deleteReceipt);

module.exports = router;
