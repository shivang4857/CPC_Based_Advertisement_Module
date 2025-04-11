const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletControllers');

// Create (or initialize) a wallet for a user
router.post('/', walletController.createWallet);

// Get wallet details for a user
router.get('/:userId', walletController.getWallet);

// Add a transaction (credit or debit) to a wallet
router.post('/:userId/transaction', walletController.addTransaction);

// Retrieve wallet history: top-up details and last five transactions
router.get('/:userId/history', walletController.getWalletHistory);

module.exports = router;

