const GreenService = require('../models/GreenService');

// GET /api/green-services?category=
exports.getServices = async (req, res) => {
  try {
    const { category = 'All' } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const services = await GreenService.find(filter).sort({ name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
