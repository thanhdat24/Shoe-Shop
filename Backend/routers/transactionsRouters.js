const express = require('express');
const transactionsController = require('../controllers/transactionsController');

const router = express.Router();

router.route('/').get(transactionsController.getAllTransactions);

router
  .route('/:id')
  .delete(transactionsController.deleteTransactions)
  .get(transactionsController.getDetailTransactions)
  .patch(transactionsController.updateTransactions);
module.exports = router;
