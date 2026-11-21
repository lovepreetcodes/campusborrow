const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    posterName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'general' },
    type: {
      type: String,
      enum: ['borrow', 'giveaway', 'request','sell'],
      default: 'borrow',
    },
    status: {
      type: String,
      enum: ['available', 'claimed'],
      default: 'available',
    },
    pickupSpot: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);