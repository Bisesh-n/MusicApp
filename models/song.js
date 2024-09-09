const { getDB, ObjectId } = require('./db');

// Create a new song
async function createSong(song) {
    const db = await getDB();
    const result = await db.collection('Song').insertOne(song);  // Use 'Song' collection
    return result.insertedId;
}

// Read song by ID
async function getSongById(id) {
    const db = await getDB();
    const song = await db.collection('Song').findOne({ _id: ObjectId(id) });  // Use 'Song' collection
    return song;
}

// Read all songs for a specific artist
async function getSongsByArtistId(artistId) {
    const db = await getDB();
    const songs = await db.collection('Song').find({ artistId: ObjectId(artistId) }).toArray();  // Use 'Song' collection
    return songs;
}

// Update song by ID
async function updateSong(id, update) {
    const db = await getDB();
    const result = await db.collection('Song').updateOne({ _id: ObjectId(id) }, { $set: update });  // Use 'Song' collection
    return result.modifiedCount > 0;
}

// Delete song by ID
async function deleteSong(id) {
    const db = await getDB();
    const result = await db.collection('Song').deleteOne({ _id: ObjectId(id) });  // Use 'Song' collection
    return result.deletedCount > 0;
}

module.exports = { createSong, getSongById, getSongsByArtistId, updateSong, deleteSong };
