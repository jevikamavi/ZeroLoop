const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    city: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  },
  { _id: true }
);


const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    points: { type: Number, default: 0 },
    planName: { type: String, default: 'ZeroLoop Plus — Weekly' },
    addresses: { type: [addressSchema], default: [] },
    notificationPrefs: {
      emailReminders: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: true },
      missedAlerts: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: false }
    },

    redemptions: {
      type: [
        {
          name: String,
          cost: Number,
          redeemedAt: { type: Date, default: Date.now }
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
