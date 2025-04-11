const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    transactions: [
        {
            type: { type: String, enum: ['credit', 'debit'], required: true },
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
            description: { type: String }
        }
    ]
});


const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
