const { getDB, ObjectId } = require('./db');

// Create a new artist
async function createArtist(artist) {
    const db = await getDB();
    const result = await db.collection('Artist').insertOne(artist);  // Use 'Artist' collection
    return result.insertedId;
}

// Read artist by ID
async function getArtistById(id) {
    const db = await getDB();
    const artist = await db.collection('Artist').findOne({ _id: ObjectId(id) });  // Use 'Artist' collection
    return artist;
}

// Read all artists
async function getAllArtists() {
    const db = await getDB();
    const artists = await db.collection('Artist').find().toArray();  // Use 'Artist' collection
    return artists;
}

// Update artist by ID
async function updateArtist(id, update) {
    const db = await getDB();
    const result = await db.collection('Artist').updateOne({ _id: ObjectId(id) }, { $set: update });  // Use 'Artist' collection
    return result.modifiedCount > 0;
}

// Delete artist by ID
async function deleteArtist(id) {
    const db = await getDB();
    const result = await db.collection('Artist').deleteOne({ _id: ObjectId(id) });  // Use 'Artist' collection
    return result.deletedCount > 0;
}

module.exports = { createArtist, getArtistById, getAllArtists, updateArtist, deleteArtist };
