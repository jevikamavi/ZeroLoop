const mongoose = require('mongoose');

const recyclingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Recycle', 'Compost', 'Trash', 'Hazardous'], required: true },
  note: { type: String, required: true },
  diyVideoUrl: { type: String, default: '' },
  diyProductUrl: { type: String, default: '' }
});

module.exports = mongoose.model('RecyclingItem', recyclingItemSchema);
