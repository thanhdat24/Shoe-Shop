const express = require('express');

const paymentController = require('../controllers/paymentController');
const router = express.Router();

router.route('/create').post(paymentController.createMoMoPayment);
router.route('/refund').post(paymentController.refundMoMoPayment);
router.route('/query').post(paymentController.queryPayment);

router
  .route('/')
  .get(paymentController.getAllPayment)
  .post(paymentController.createPayment);

router.route('/:id').patch(paymentController.updatePayment);
module.exports = router;
