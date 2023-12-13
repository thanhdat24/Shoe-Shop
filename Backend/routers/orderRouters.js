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
  .route('/best-selling-products-revenue')
  .get(orderController.bestSellingProductsRevenue);

router.route('/getAllUpdate').get(orderController.getAllUpdate);
router.route('/totalRevenue').get(orderController.totalRevenue);
router
  .route('/autoUpdateOrderStatus')
  .get(orderController.autoUpdateOrderStatus);

router
  .route('/:id')
  .get(orderController.getDetailOrder)
  .put(orderController.updateOrder);

module.exports = router;
