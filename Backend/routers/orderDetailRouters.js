const express = require('express');

const orderDetailController = require('../controllers/orderDetailController');
const router = express.Router();

router.route('/').get(orderDetailController.getAllOrderDetail);

module.exports = router;
