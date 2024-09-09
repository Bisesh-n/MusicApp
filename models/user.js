const { getDB } = require('./db');

async function listUsers(req, res) {
  const db = getDB();
  const users = await db.collection('User').find({}).toArray();
  res.status(200).json(users);
}

async function createUser(req, res) {
  const { email, password } = req.body;
  const db = getDB();
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('User').insertOne({ email, password: hashedPassword, role: 'user' });
  res.status(201).json(result);
}

async function updateUser(req, res) {
  const { id } = req.params;
  const db = getDB();
  const result = await db.collection('User').updateOne({ _id: id }, { $set: req.body });
  res.status(200).json(result);
}

async function deleteUser(req, res) {
  const { id } = req.params;
  const db = getDB();
  const result = await db.collection('User').deleteOne({ _id: id });
  res.status(200).json(result);
}

module.exports = { listUsers, createUser, updateUser, deleteUser };
