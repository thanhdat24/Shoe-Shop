const express = require('express');
const shipperController = require('../controllers/shipperController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/order-shipper',
  authController.protect,
  shipperController.getOrderByShipper
);

router
  .route('/')
  .post(shipperController.createShipper)
  .get(shipperController.getAllShipper);

router
  .route('/:id')
  .delete(shipperController.deleteShipper)
  .get(shipperController.getDetailShipper)
  .put(shipperController.updateShipper);

router.post('/login-shipper', shipperController.login);

module.exports = router;
