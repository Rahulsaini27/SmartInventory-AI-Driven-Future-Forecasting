const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/TransactionController');

// Routes for transactions
router.get('/', transactionController.getAllTransactions);
router.post('/complete', transactionController.createTransaction);

module.exports = router;
