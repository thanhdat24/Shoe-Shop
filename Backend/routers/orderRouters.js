const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/', authController.protectUser, orderController.createOrder);

router.route('/').get(orderController.getAllOrder);
router.route('/notifications').get(orderController.getNotifications);

router.get(
  '/getMeOrder',
  authController.protectUser,
  orderController.getMeOrder
);

router
  .route('/monthly-product-revenue/:id')
  .get(orderController.monthlyProductRevenue);

router
  .route('/yearly-product-revenue/:id')
  .get(orderController.yearlyProductRevenue);

router
  .route('/:id')
  .get(orderController.getDetailOrder)
  .put(orderController.updateOrder);

module.exports = router;
