const express = require('express');

const OTPController = require('../controllers/OTPController');
const router = express.Router();

router.route('/').get(OTPController.getAllOTP);
router.route('/sendOTP').post(OTPController.createOTP);
router.route('/verifyOTP').post(OTPController.verifyOTPGoogle);

module.exports = router;
