const mongoose = require('mongoose');


const recurringScheduleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    wasteType: { type: String, enum: ['trash', 'recycle', 'compost'], required: true },
    days: { type: [String], default: [] }
  },
  { timestamps: true }
);

// one user can have only one schedule per waste type
recurringScheduleSchema.index({ userId: 1, wasteType: 1 }, { unique: true });

module.exports = mongoose.model('RecurringSchedule', recurringScheduleSchema);
