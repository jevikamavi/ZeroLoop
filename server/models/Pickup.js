const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    route: { type: String, default: 'Route 12 — Hauz Khas Zone' },
    ticketId: { type: String, required: true, unique: true },
    kind: { type: String, enum: ['recurring', 'extra'], default: 'extra' },
    status: { type: String, enum: ['scheduled', 'completed', 'missed'], default: 'scheduled' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pickup', pickupSchema);
