// Everything about items: list them, post one, delete one.
// (server.js mounts this file at /api/items)

const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');
const { requireLogin, optionalLogin } = require('../middleware/auth');

const router = express.Router();

// GET /api/items?type=borrow   (anyone can call this)
router.get('/', optionalLogin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type && req.query.type !== 'all') {
      filter.type = req.query.type;
    }

    let query = Item.find(filter).sort({ createdAt: -1 }); // newest first

    // Guests (not logged in) do not get to see contact details
    if (!req.userId) {
      query = query.select('-phone -contact');
    }

    res.json(await query);
  } catch {
    res.status(500).json({ message: 'Could not load items' });
  }
});

// POST /api/items   (login required)
router.post('/', requireLogin, async (req, res) => {
  try {
    const { title, type, description, imageUrl, contact } = req.body;
    const user = await User.findById(req.userId);

    const item = await Item.create({
      title,
      type,
      description,
      imageUrl,
      phone: contact,                    // the form's "contact" is stored as "phone"
      posterName: user ? user.name : 'Student',
      owner: req.userId,                 // taken from the token, so it cannot be faked
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/items/:id   (login required, owner only)
router.delete('/:id', requireLogin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own items' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch {
    res.status(400).json({ message: 'Invalid item ID' });
  }
});

module.exports = router;
