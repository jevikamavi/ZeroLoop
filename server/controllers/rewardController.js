const Account = require('../models/Account');

const catalog = [
  { id: 'credit-5', name: '₹400 Service Credit', cost: 500 },
  { id: 'tote', name: 'Reusable Jute Tote Bag', cost: 300 },
  { id: 'cottonbag', name: 'Reusable Cotton Bag', cost: 200 },
  { id: 'compostbin', name: 'Compost Bin', cost: 1500 },
  { id: 'indoorplant', name: 'Indoor Plant', cost: 400 },
  { id: 'matka', name: 'Earthern Pot - Matka', cost: 400 },
  { id: 'tree', name: 'Plant a Tree (Donation)', cost: 200 },
  { id: 'bulk-voucher', name: 'Extra Bulk Pickup Voucher', cost: 800 }
    
];
// GET /api/rewards
exports.getCatalog = async (req, res) => {
  try {
    let account = await Account.findOne({ userId: req.userId });
    if (!account) account = await Account.create({ userId: req.userId });
    res.json({ catalog, points: account.points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rewards/redeem  
exports.redeem = async (req, res) => {
  try {
    const { rewardId } = req.body;
    const reward = catalog.find((r) => r.id === rewardId);
    if (!reward) return res.status(404).json({ message: 'Unknown reward' });

    const account = await Account.findOne({ userId: req.userId });
    if (!account || account.points < reward.cost) {
      return res.status(400).json({ message: 'Not enough points' });
    }
    account.points -= reward.cost;
    // keeping a small record of what was redeemed
    account.redemptions.push({ name: reward.name, cost: reward.cost });
    await account.save();
    res.json({ points: account.points, redeemed: reward.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
