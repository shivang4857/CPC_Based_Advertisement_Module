const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  duration: { type: Number, required: true }, // in days
  cpc: { type: Number, required: true },
  adContent: { type: String, required: true },
  winningAdvertiser: { type: mongoose.Schema.Types.ObjectId, ref: "Advertiser", default: null },
  winningBid: { type: Number, default: 0 }
});

module.exports = mongoose.model("Campaign", CampaignSchema);
