const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db');

const secretKey = 'key@123'; 

// Register new admin user
async function register(req, res) {
  const { email, password } = req.body;
  const db = getDB();
  const existingUser = await db.collection('User').findOne({ email });

  if (existingUser) return res.status(400).send('User already exists.');

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('User').insertOne({ email, password: hashedPassword, role: 'admin' });

  res.status(201).send('User registered successfully.');
}

// Login admin user
async function login(req, res) {
  const { email, password } = req.body;
  const db = getDB();
  const user = await db.collection('User').findOne({ email });

  if (!user) return res.status(400).send('Invalid credentials.');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials.');

  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
  res.status(200).json({ token });
}

module.exports = { register, login };
