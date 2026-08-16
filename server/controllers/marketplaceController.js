const MarketplaceItem = require('../models/MarketplaceItem');

// GET /api/marketplace?category=
exports.getListings = async (req, res) => {
  try {
    const { category = 'All' } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const items = await MarketplaceItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/marketplace
exports.createListing = async (req, res) => {
  try {
    const { name, description, category, priceType, price, seller } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const item = await MarketplaceItem.create({
      name,
      description: description || '',
      category: category || 'Other',
      priceType: priceType || 'inr',
      price: priceType === 'free' ? 0 : Number(price) || 0,
      seller: seller || 'ZeroLoop Member'
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
