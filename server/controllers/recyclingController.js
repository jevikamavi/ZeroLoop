const RecyclingItem = require('../models/RecyclingItem');

// GET /api/recycling?q=&category=
exports.search = async (req, res) => {
  try {
    const { q = '', category = 'All' } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const items = await RecyclingItem.find(filter).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
