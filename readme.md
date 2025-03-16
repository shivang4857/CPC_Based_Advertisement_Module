# CPC-Based Advertisement System Documentation

---
## Technology Stack

- **Node.js & Express:** Backend server framework.
- **MongoDB:** Database for storing advertiser and campaign data.
- **Mongoose:** ODM (Object Document Mapper) for MongoDB.
- **Cron (node-cron):** For scheduled tasks, such as daily resets.
- **CORS:** Middleware for handling cross-origin requests.
- **dotenv:** For managing environment variables.

---
## Models
   Advertiser Model (models/Advertiser.js)
- Purpose: Defines the schema for advertisers.
- Key Fields:
- name: Name of the advertiser.
- wallet: Available balance.
- dailyLimit: Maximum spending allowed per day.
- dailySpent: Amount spent in the current day.

 Campaign Model (models/Campaign.js)
- Purpose: Defines the schema for campaigns.
- Key Fields:
- startDate: When the campaign begins.
- duration: Duration of the campaign in days.
- cpc: Baseline cost-per-click value.
- adContent: Content or message of the ad.
- winningAdvertiser: Reference to the advertiser who wins the bid.
- winningBid: The highest bid received.
- 
---
## ROUTES 

### Advertiser Routes (`routes/advertiserRoutes.js`)

**Purpose:** Provides endpoints to manage advertisers.

#### Endpoints:

- **Create Advertiser**: `POST /api/advertisers`  
- **Get All Advertisers**: `GET /api/advertisers`  
- **Top-up Wallet**: `POST /api/advertisers/:id/wallet`  
- **Set Daily Spending Limit**: `POST /api/advertisers/:id/daily-limit`  

#### Key Functions:

- Creating and retrieving advertiser records.  
- Managing wallet balance and daily spending limits.  

---

### Campaign Routes (`routes/campaignRoutes.js`)

**Purpose:** Provides endpoints to manage campaigns and bidding.

#### Endpoints:

- **Create Campaign**: `POST /api/campaigns`  
- **Get All Campaigns**: `GET /api/campaigns`  
- **Bid on a Campaign**: `POST /api/campaigns/:campaignId/bid`  
  - Advertisers bid on a campaign. The endpoint validates:  
    - Campaign activity (date within `startDate` and `duration`).  
    - Advertiser eligibility (sufficient wallet funds and not exceeding daily limit).  
    - Bid value compared to current highest bid; if equal, ranking (based on `dailyLimit`) is used.  
- **Serve the Ad**: `GET /api/campaigns/:campaignId/serve`  
  - Simulates an ad impression by deducting the winning bid amount from the advertiser’s wallet and updating `dailySpent`, then returns the ad content.  

#### Key Functions:

- Creating campaigns without an advertiser attached.  
- Allowing advertisers to bid on campaigns.  
- Implementing prioritization and ranking logic for bidding.  
- Simulating ad serving and deducting bid amounts.  
-
---

## Application Workflow

### Initialization:

The application starts in server.js, loads environment variables, connects to MongoDB, sets up middleware, and registers routes.
A cron job resets all advertisers' dailySpent values at midnight.
Advertiser Management:

Advertisers are created and managed via their endpoints. They can top-up their wallet and set a daily spending limit.
Campaign Lifecycle:

- Creation: Campaigns are created with a start date, duration, baseline CPC, and ad content.
- Bidding: Advertisers bid on active campaigns. The bidding endpoint:
     - Validates the campaign is active.
     - Ensures the advertiser has sufficient funds and has not exceeded their daily limit.
    - Uses bid amount and, if equal, the advertiser's dailyLimit for ranking.
    - Updates the campaign with the winning bid and advertiser.
- Ad Serving: When an ad is served, the winning advertiser’s wallet is debited and dailySpent is updated

---
## Future Enhancements
- Advanced Bidding Strategies:
Implement auto-bidding, time-based bidding, and more granular bid increments.

- Enhanced Analytics:
Build dashboards to provide advertisers insights into their spending and campaign performance.

- Fraud Prevention:
Add mechanisms to detect and prevent fraudulent bidding behavior.

- Additional Ranking Factors:
Integrate historical performance metrics, click-through rates, or advertiser ratings as additional tiebreakers.





