const mongoose = require('mongoose');
const greenServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Solar', 'E-Waste', 'Composting', 'Water', 'EV Charging', 'Plantation'],
      required: true
    },
    provider: { type: String, required: true },
    description: { type: String, default: '' },
    contact: { type: String, default: '' },
    area: { type: String, default: 'New Delhi' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GreenService', greenServiceSchema);
