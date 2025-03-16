const express = require("express");
const Advertiser = require("../models/Advertiser");

const router = express.Router();

// Create an advertiser
router.post("/", async (req, res) => {
  try {
    const advertiser = new Advertiser(req.body);
    await advertiser.save();
    res.json(advertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all advertisers
router.get("/", async (req, res) => {
  const advertisers = await Advertiser.find();
  res.json(advertisers);
});

// Top-up wallet
router.post("/:id/wallet", async (req, res) => {
  const { amount } = req.body;
  const advertiser = await Advertiser.findById(req.params.id);
  if (!advertiser) return res.status(404).json({ message: "Advertiser not found" });

  advertiser.wallet += amount;
  await advertiser.save();
  res.json({ message: "Wallet updated", wallet: advertiser.wallet });
});

// Set daily spending limit
router.post("/:id/daily-limit", async (req, res) => {
  const { dailyLimit } = req.body;
  const advertiser = await Advertiser.findById(req.params.id);
  if (!advertiser) return res.status(404).json({ message: "Advertiser not found" });

  advertiser.dailyLimit = dailyLimit;
  await advertiser.save();
  res.json({ message: "Daily limit updated", dailyLimit: advertiser.dailyLimit });
});

module.exports = router;
