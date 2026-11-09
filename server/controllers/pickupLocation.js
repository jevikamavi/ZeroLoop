const Pickup = require('../models/Pickup');
const RecurringSchedule = require('../models/RecurringSchedule');

const genTicketId = (suffix = 'X') =>
  `ZL-${Math.floor(40000 + Math.random() * 9000)}-${suffix}`;

// GET /api/pickups/upcoming
exports.getUpcoming = async (req, res) => {
  try {
    // only pickups from today onwards: past bookings must not show up as "next pickup"
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const pickups = await Pickup.find({
      userId: req.userId,
      status: 'scheduled',
      date: { $gte: startOfToday }
    }).sort({ date: 1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/pickups/extra  { types: string[], date: string, notes?: string }
exports.requestExtraPickup = async (req, res) => {
  try {
    const { types, date, notes } = req.body;
    if (!Array.isArray(types) || types.length === 0 || !date) {
      return res.status(400).json({ message: 'types (array) and date are required' });
    }
    const pickup = await Pickup.create({
      userId: req.userId,
      date,
      type: types.join(' + '),
      ticketId: genTicketId(),
      kind: 'extra',
      notes: notes || ''
    });
    res.status(201).json(pickup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/pickups/recurring
exports.getRecurringSchedule = async (req, res) => {
  try {
    res.json(await RecurringSchedule.find({ userId: req.userId }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/pickups/recurring
exports.saveRecurringSchedule = async (req, res) => {
  try {
    const updates = req.body || {};
    const saved = [];
    for (const wasteType of Object.keys(updates)) {
      const doc = await RecurringSchedule.findOneAndUpdate(
        { userId: req.userId, wasteType },
        { userId: req.userId, wasteType, days: updates[wasteType] },
        { upsert: true, new: true }
      );
      saved.push(doc);
    }
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
