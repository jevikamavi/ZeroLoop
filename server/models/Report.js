const mongoose = require('mongoose');

// for filing complaints
const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, default: '' },
    date: { type: Date },
    status: { type: String, enum: ['submitted', 'in_review', 'resolved'], default: 'submitted' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
