const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Compost', 'Upcycled', 'Plants', 'Repair Services', 'Other'],
      default: 'Other'
    },
    priceType: { type: String, enum: ['points', 'inr', 'free'], default: 'inr' },
    price: { type: Number, default: 0 },
    seller: { type: String, default: 'ZeroLoop Member' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
