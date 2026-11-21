const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['borrow', 'giveaway', 'request'],
      default: 'borrow',
    },
    contact: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    deleteKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);