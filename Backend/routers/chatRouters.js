const express = require('express');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protectUser, chatController.createChat)
  .get(chatController.getAllChat);

router.route('/:chatId/send').post(chatController.sendChat);

module.exports = router;
