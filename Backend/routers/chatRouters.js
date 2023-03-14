const express = require('express');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(chatController.getAllChat);

router
  .route('/current')
  .get(authController.protectUser, chatController.getCurrentChat);

router
  .route('/contact')
  .post(authController.protectUser, chatController.createChat);

router.route('/:chatId/send').post(chatController.sendChat);

module.exports = router;
