// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dailyBudget: { type: Number, required: true },
    maxBid: { type: Number, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ['active', 'paused', 'ended'], default: 'active' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    lastReset: { type: Date, default: Date.now },  // NEW FIELD: last time the spend was reset
    metrics: {
        clicks: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        spend: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Campaign', campaignSchema);
