const Account = require('../models/Account');
const Report = require('../models/Report');
const Pickup = require('../models/Pickup');

// GET /api/account
exports.getAccount = async (req, res) => {
  try {
    let account = await Account.findOne({ userId: req.userId });
    if (!account) account = await Account.create({ userId: req.userId });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/account  { name, email, phone }
exports.updateAccount = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const account = await Account.findOneAndUpdate(
      { userId: req.userId },
      { $set: { name, email, phone } },
      { new: true, upsert: true }
    );
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/account/notifications  { emailReminders, smsAlerts, missedAlerts, productUpdates }
exports.updateNotifications = async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { userId: req.userId },
      { $set: { notificationPrefs: req.body } },
      { new: true, upsert: true }
    );
    res.json(account.notificationPrefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/account/addresses  { label, city }
exports.addAddress = async (req, res) => {
  try {
    const { label, city } = req.body;
    if (!label || !city) return res.status(400).json({ message: 'label and city are required' });
    let account = await Account.findOne({ userId: req.userId });
    if (!account) account = await Account.create({ userId: req.userId });
    account.addresses.push({ label, city, isPrimary: account.addresses.length === 0 });
    await account.save();
    res.status(201).json(account.addresses[account.addresses.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/account/addresses/:addressId/primary
exports.setPrimaryAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const account = await Account.findOne({ userId: req.userId });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    account.addresses.forEach((a) => {
      a.isPrimary = String(a._id) === addressId;
    });

    // reordering primary address
    account.addresses.sort((a, b) => (b.isPrimary === true) - (a.isPrimary === true));
    await account.save();
    res.json(account.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/account/activity
exports.getActivity = async (req, res) => {
  try {
    const [reports, pickups, account] = await Promise.all([
      Report.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(8),
      Pickup.find({ userId: req.userId, kind: 'extra' }).sort({ createdAt: -1 }).limit(8),
      Account.findOne({ userId: req.userId })
    ]);

    const events = [];

    reports.forEach((r) => {
      events.push({ text: `Issue reported — ${r.type} (${r.ticketId})`, time: r.createdAt, color: 'red' });
    });

    pickups.forEach((p) => {
      events.push({ text: `Extra pickup requested — ${p.type}`, time: p.createdAt, color: 'blue' });
    });

    (account?.redemptions || []).forEach((r) => {
      events.push({ text: `Redeemed reward — ${r.name}`, time: r.redeemedAt, color: 'amber' });
    });

    events.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json(events.slice(0, 6));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
