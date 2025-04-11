// controllers/campaignController.js
const Campaign = require('../models/Campaign');

// Create a new campaign
exports.createCampaign = async (req, res) => {
    try {
        const { userId, dailyBudget, maxBid, productId } = req.body;
        const campaign = new Campaign({ userId, dailyBudget, maxBid, productId });
        await campaign.save();
        res.status(201).json(campaign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a campaign
exports.updateCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const updateData = req.body;
        const campaign = await Campaign.findByIdAndUpdate(campaignId, updateData, { new: true });
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json(campaign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get campaigns with optional filtering and sorting
exports.getCampaigns = async (req, res) => {
    try {
        const { status, sort, order } = req.query;
        let query = {};
        if (status) query.status = status;
        let sortOption = {};
        if (sort) sortOption[sort] = order === 'asc' ? 1 : -1;
        const campaigns = await Campaign.find(query).sort(sortOption);
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get only active campaigns (where spend < dailyBudget)
exports.getActiveCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({
            status: 'active',
            $expr: { $lt: ["$metrics.spend", "$dailyBudget"] }
        });
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get daily limit info for a user's active campaigns
exports.getDailyLimits = async (req, res) => {
    try {
        const { userId } = req.params;
        const campaigns = await Campaign.find({ userId, status: 'active' });
        const dailyLimits = campaigns.map(campaign => ({
            campaignId: campaign._id,
            dailyBudget: campaign.dailyBudget,
            spent: campaign.metrics.spend,
            remaining: campaign.dailyBudget - campaign.metrics.spend
        }));
        res.json(dailyLimits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



