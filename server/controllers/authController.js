const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');
const { JWT_SECRET } = require('../middleware/auth');

function makeToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

// POST /api/auth/register  { name, email, password, address? }
exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be at least 6 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists — try logging in instead.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: passwordHash });

    // new user get own account
    await Account.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      points: 100,
      addresses: address && address.trim() ? [{ label: address.trim(), city: 'New Delhi', isPrimary: true }] : []
    });

    const token = makeToken(user._id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login  { email, password }
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Incorrect email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect email or password.' });

    const token = makeToken(user._id);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me (valididty of token)
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
