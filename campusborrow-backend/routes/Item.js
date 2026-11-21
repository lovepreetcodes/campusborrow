const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

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

// POST /api/items - Post an item (requires login)
router.post('/', auth, async (req, res) => {
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
      posterName: posterName.trim(),
      phone: phone.trim(),
      title: title.trim(),
      description,
      category,
      type,
      pickupSpot,
      owner: req.userId,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/items/:id - Only the item owner can delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (!item.owner || item.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own items' });
    }

    await item.deleteOne();
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});
// PATCH /api/items/:id/status - Toggle between 'available' and 'claimed' (requires login)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Use requested status if valid, otherwise toggle current status
    let nextStatus;
    if (req.body && ['available', 'claimed'].includes(req.body.status)) {
      nextStatus = req.body.status;
    } else {
      nextStatus = item.status === 'claimed' ? 'available' : 'claimed';
    }

    // Optional simple rule: prevent claiming your own item
    if (
      nextStatus === 'claimed' &&
      item.owner &&
      item.owner.toString() === req.userId
    ) {
      return res.status(400).json({ error: 'You cannot claim your own item' });
    }

    item.status = nextStatus;

    // If your Item schema has claimedBy, keep it in sync
    if ('claimedBy' in item) {
      item.claimedBy = nextStatus === 'claimed' ? req.userId : null;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID or status update failed' });
  }
});

module.exports = router;