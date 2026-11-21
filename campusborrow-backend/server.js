const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('DB Error:', err));

// 1. GET all items (with simple optional filtering)
app.get('/api/items', async (req, res) => {
  try {
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const items = await Item.find(filter)
      .select('-deleteKey')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch items' });
  }
});

// 2. POST a new item
app.use(express.json()); // Required so req.body is readable!

app.post('/api/items', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. DELETE an item (once the student no longer needs/has it)
app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.deleteKey !== req.body.deleteKey) {
      return res.status(403).json({ error: 'Wrong delete key' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid item ID' });
  }
});
// Toggle status between 'available' and 'claimed' using deleteKey
app.patch('/api/items/:id/status', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.deleteKey !== req.body.deleteKey) {
      return res.status(403).json({ error: 'Wrong key' });
    }

    const nextStatus = item.status === 'claimed' ? 'available' : 'claimed';
    item.status = nextStatus;
    await item.save();

    res.json({ _id: item._id, status: item.status });
  } catch (err) {
    res.status(400).json({ error: 'Could not update status' });
  }
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});