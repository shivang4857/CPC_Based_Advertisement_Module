const mongoose = require("mongoose");

const AdvertiserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  wallet: { type: Number, default: 0 },
  dailyLimit: { type: Number, default: 10 },
  dailySpent: { type: Number, default: 0 },
});

module.exports = mongoose.model("Advertiser", AdvertiserSchema);
