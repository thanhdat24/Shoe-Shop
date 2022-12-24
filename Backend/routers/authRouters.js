const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/sendOtp', authController.sendOtp);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);

module.exports = router;
