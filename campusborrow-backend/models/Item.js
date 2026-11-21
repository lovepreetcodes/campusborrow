const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    posterName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['borrow', 'giveaway', 'request', 'sell'],
      default: 'borrow',
    },
    status: {
      type: String,
      enum: ['available', 'claimed'],
      default: 'available',
    },
    imageUrl: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);