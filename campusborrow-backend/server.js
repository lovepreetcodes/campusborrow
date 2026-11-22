// Entry point: sets up the server, connects to MongoDB and plugs in the routes.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // loads MONGO_URI, JWT_SECRET, PORT from the .env file

const app = express();

// Middleware that runs on every request
app.use(cors());                          // lets the React app (another port) call this API
app.use(express.json({ limit: '5mb' }));  // reads JSON bodies (5mb because photos are sent as text)

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('DB Error:', err));

// Routes: each URL prefix is handled by its own file
app.use('/api/auth', require('./routes/auth'));    // register, login
app.use('/api/items', require('./routes/items'));  // list, post, delete items

// Start listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
