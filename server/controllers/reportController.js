const Report = require('../models/Report');
const genTicketId = () => `RPT-${Math.floor(1000 + Math.random() * 9000)}`;

// GET /api/reports
exports.getReports = async (req, res) => {
  try {
    res.json(await Report.find({ userId: req.userId }).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { type, description, address, date } = req.body;
    if (!type || !description) {
      return res.status(400).json({ message: 'type and description are required' });
    }

    const report = await Report.create({
      userId: req.userId,
      ticketId: genTicketId(),
      type,
      description,
      address: address || '',
      date: date || undefined
    });
    
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
