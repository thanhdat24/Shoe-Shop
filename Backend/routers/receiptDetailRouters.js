const express = require('express');

const receiptDetailController = require('../controllers/receiptDetailController');
const router = express.Router();

router
  .route('/')
  .get(receiptDetailController.getAllReceiptDetail)
  .post(receiptDetailController.createReceiptDetail);

router.route('/:id').get(receiptDetailController.getDetailReceiptDetail);

module.exports = router;
