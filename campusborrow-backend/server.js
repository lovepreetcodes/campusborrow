const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');
const Item = require('./models/Item');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken'); 
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('DB Error:', err));

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// 1. GET all items (public feed + optional filtering)
// 1. GET all items (hides contact info if not logged in)
app.get('/api/items', async (req, res) => {
  try {
    const filter = {};

    if (req.query.type && req.query.type !== 'all') {
      filter.type = req.query.type;
    }
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    // Check if request has a valid token
    let isAuthenticated = false;
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme === 'Bearer' && token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    let query = Item.find(filter).sort({ createdAt: -1 });
    if (!isAuthenticated) {
      query = query.select('-contact -phone');
    }

    const items = await query;
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch items' });
  }
});

// 2. POST a new item (requires login)
// 2. POST a new item (requires login)
app.post('/api/items', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).select('name');
    const posterName =
      (req.body.posterName && req.body.posterName.trim()) ||
      currentUser?.name ||
      'Student';
    const phone =
      (req.body.phone && req.body.phone.trim()) ||
      (req.body.contact && req.body.contact.trim()) ||
      '';

    const item = await Item.create({
      ...req.body,
      posterName,
      phone,
      contact: req.body.contact || phone,
      owner: req.userId,
      status: 'available',
      claimedBy: null,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// 3. DELETE an item (only the owner can delete)
app.delete('/api/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!item.owner || item.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not allowed to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid item ID' });
  }
});

// 4. Toggle status between 'available' and 'claimed' (requires login)
app.patch('/api/items/:id/status', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const nextStatus =
      req.body && ['available', 'claimed'].includes(req.body.status)
        ? req.body.status
        : item.status === 'claimed'
        ? 'available'
        : 'claimed';

    if (
      nextStatus === 'claimed' &&
      item.owner &&
      item.owner.toString() === req.userId
    ) {
      return res.status(400).json({ error: 'You cannot claim your own item' });
    }

    item.status = nextStatus;
    if ('claimedBy' in item) {
      item.claimedBy = nextStatus === 'claimed' ? req.userId : null;
    }

    await item.save();
    res.json({ _id: item._id, status: item.status, claimedBy: item.claimedBy });
  } catch (err) {
    res.status(400).json({ error: 'Could not update status' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});