// Register and login. Both reply with a token (the "wristband") and basic user info.

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Creates a token that contains the user's id and expires in 7 days
function makeToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// What we send back to the frontend (never includes the password)
function loginResponse(user) {
  return {
    token: makeToken(user),
    user: { id: user._id, name: user.name, email: user.email },
  };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, email and a 6+ character password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (await User.findOne({ email: cleanEmail })) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Store a scrambled (hashed) password, never the real one
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: cleanEmail, password: hashedPassword });

    res.status(201).json(loginResponse(user));
  } catch {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Compare the typed password with the stored hash
    const passwordOk = user && (await bcrypt.compare(password, user.password));
    if (!passwordOk) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(loginResponse(user));
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
