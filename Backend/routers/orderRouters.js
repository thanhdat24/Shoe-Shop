const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/', authController.protectUser, orderController.createOrder);

router.route('/').get(orderController.getAllOrder);

router.route('/:id').get(orderController.getDetailOrder);

module.exports = router;
