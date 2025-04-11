
// controllers/walletController.js
const Wallet = require('../models/Wallet');

// Create (or initialize) a wallet for a user
exports.createWallet = async (req, res) => {
    try {
        const { userId, balance, currency } = req.body;
        let wallet = await Wallet.findOne({ userId });
        if (wallet) return res.status(400).json({ error: 'Wallet already exists for this user.' });
        wallet = new Wallet({ userId, balance, currency });
        await wallet.save();
        res.status(201).json(wallet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get wallet information for a user
exports.getWallet = async (req, res) => {
    try {
        const { userId } = req.params;
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) return res.status(404).json({ error: 'Wallet not found.' });
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a transaction (credit or debit) to a user's wallet
exports.addTransaction = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, amount, description } = req.body;
        let wallet = await Wallet.findOne({ userId });
        if (!wallet) return res.status(404).json({ error: 'Wallet not found.' });
        if (type === 'debit' && wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        wallet.balance = type === 'credit' ? wallet.balance + amount : wallet.balance - amount;
        wallet.transactions.push({ type, amount, description });
        await wallet.save();
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Retrieve wallet history: top-up details and the last five transactions overall
exports.getWalletHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) return res.status(404).json({ error: 'Wallet not found.' });
        
        // Top-up transactions (credits)
        const topUpTransactions = wallet.transactions.filter(txn => txn.type === 'credit');
        // Sort transactions by date (most recent first)
        const sortedTransactions = wallet.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Get the last five transactions
        const lastFiveTransactions = sortedTransactions.slice(0, 5);
        
        res.json({
            walletId: wallet._id,
            balance: wallet.balance,
            topUpTransactions,
            lastFiveTransactions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
