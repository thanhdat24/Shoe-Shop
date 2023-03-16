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

router.route('/conversation').get(chatController.getDetailConversation);

router.route('/participants').get(chatController.getParticipants);

router.route('/search').get(chatController.searchParticipants);

router.route('/:chatId/send').post(chatController.sendChat);

module.exports = router;
