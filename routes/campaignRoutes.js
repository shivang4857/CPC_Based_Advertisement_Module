// routes/campaignRoutes.js
const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignControllers');

// Create a new campaign
router.post('/', campaignController.createCampaign);

// Update an existing campaign
router.put('/:campaignId', campaignController.updateCampaign);

// Get campaigns with optional filtering and sorting
router.get('/', campaignController.getCampaigns);

// Get only active campaigns (where spend is below daily budget)
router.get('/active', campaignController.getActiveCampaigns);

// Get daily limit info for a user's active campaigns
router.get('/daily-limit/:userId', campaignController.getDailyLimits);

module.exports = router;
