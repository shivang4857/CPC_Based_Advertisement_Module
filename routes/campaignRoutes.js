const express = require("express");
const Campaign = require("../models/Campaign");
const Advertiser = require("../models/Advertiser");

const router = express.Router();

// Create a campaign (no advertiserId required)
router.post("/", async (req, res) => {
  try {
    // Expect startDate, duration, cpc, and adContent in request body.
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all campaigns (populate winningAdvertiser if exists)
router.get("/", async (req, res) => {
  const campaigns = await Campaign.find().populate("winningAdvertiser");
  res.json(campaigns);
});

// Advertiser bids for a campaign
router.post("/:campaignId/bid", async (req, res) => {
  const { advertiserId, bid } = req.body;
  const campaign = await Campaign.findById(req.params.campaignId);
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  
  const now = new Date();
  const campaignEnd = new Date(campaign.startDate.getTime() + campaign.duration * 24 * 60 * 60 * 1000);
  if (now < campaign.startDate || now > campaignEnd) {
    return res.status(400).json({ message: "Campaign not active for bidding" });
  }

  const advertiser = await Advertiser.findById(advertiserId);
  if (!advertiser) return res.status(404).json({ message: "Advertiser not found" });

  // Ensure advertiser can cover the bid
  if (advertiser.wallet < bid) {
    return res.status(400).json({ message: "Insufficient funds for bid" });
  }
  if (advertiser.dailySpent + bid > advertiser.dailyLimit) {
    return res.status(400).json({ message: "Bid exceeds daily limit" });
  }
  
  // Check if the new bid is higher than the current winning bid
  if (bid <= campaign.winningBid) {
    return res.status(400).json({ message: `Bid too low. Current highest bid is ${campaign.winningBid}` });
  }
  
  // Update the campaign with the new highest bid
  campaign.winningBid = bid;
  campaign.winningAdvertiser = advertiser._id;
  await campaign.save();

  res.json({ message: "Bid accepted. You are now the highest bidder.", winningBid: campaign.winningBid });
});

// Serve the ad for a campaign (simulate an impression)
router.get("/:campaignId/serve", async (req, res) => {
  const campaign = await Campaign.findById(req.params.campaignId).populate("winningAdvertiser");
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  if (!campaign.winningAdvertiser) {
    return res.status(400).json({ message: "No winning advertiser for this campaign yet" });
  }

  // Retrieve the winning advertiser
  const advertiser = await Advertiser.findById(campaign.winningAdvertiser);
  if (advertiser.wallet < campaign.winningBid) {
    return res.status(400).json({ message: "Advertiser does not have sufficient funds to serve the ad" });
  }
  
  // Deduct the winning bid (simulate cost-per-click)
  advertiser.wallet -= campaign.winningBid;
  advertiser.dailySpent += campaign.winningBid;
  await advertiser.save();

  res.json({ message: "Ad served", ad: campaign.adContent, advertiser: advertiser.name });
});

module.exports = router;
