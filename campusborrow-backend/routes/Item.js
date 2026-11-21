const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// GET /api/items?type=borrow&category=Electronics&q=calculator
router.get('/', async (req, res) => {
  try {
    const { type, category, q } = req.query;
    const filter = {};

    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { pickupSpot: regex },
        { posterName: regex },
      ];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load items' });
  }
});

// POST /api/items - Post an item with a mandatory phone number
router.post('/', async (req, res) => {
  try {
    const { posterName, phone, title, description, category, type, pickupSpot } = req.body;

    if (!posterName || !posterName.trim()) {
      return res.status(400).json({ error: 'Your name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required so people can contact you' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Item title is required' });
    }

    const item = await Item.create({
      posterName,
      phone,
      title,
      description,
      category,
      type,
      pickupSpot,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/items/:id - Remove a post once sorted or no longer needed
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router;