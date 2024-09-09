const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://admin:admin@cluster0.hfmczcc.mongodb.net/online_store?retryWrites=true&w=majority';

let db;

async function connectDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db('Music');
  console.log('Connected to MongoDB Atlas');
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
