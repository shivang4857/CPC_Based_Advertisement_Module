require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

const advertiserRoutes = require("./routes/advertiserRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const Advertiser = require("./models/Advertiser");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/advertisers", advertiserRoutes);
app.use("/api/campaigns", campaignRoutes);

// Daily reset cron job (runs at midnight to reset dailySpent for all advertisers)
cron.schedule("0 0 * * *", async () => {
  await Advertiser.updateMany({}, { dailySpent: 0 });
  console.log("Daily spending limits reset.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
