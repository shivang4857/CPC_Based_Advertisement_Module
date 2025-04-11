require("dotenv").config();

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron'); // Required for scheduling tasks
const campaignRoutes = require('./routes/campaignRoutes');
const walletRoutes = require('./routes/walletRoutes');
const Campaign = require('./models/Campaign'); // For resetting campaign spend

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Use routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/wallet', walletRoutes);

// Cron Job: Reset campaign spend at midnight every day
cron.schedule('0 0 * * *', async () => {
    try {
        // Reset the metrics.spend for all active campaigns and update the lastReset time
        await Campaign.updateMany(
            { status: 'active' },
            { $set: { 'metrics.spend': 0, lastReset: new Date() } }
        );
        console.log('Daily campaign spend reset complete.');
    } catch (error) {
        console.error('Error resetting daily campaign spend:', error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

