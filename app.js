const express = require('express');
const { connectDB } = require('./db');


const { register, login } = require('./routes/auth');

const { listUsers, createUser, updateUser, deleteUser } = require('./user');
const { listArtists, createArtist, updateArtist, deleteArtist } = require('./artist');
const { listSongs, createSong, updateSong, deleteSong } = require('./song');


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// routes
app.post('/register', register);
app.post('/login', login);



// User routes
app.get('/users', listUsers);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

// Artist routes
app.get('/artists', listArtists);
app.post('/artists', createArtist);
app.put('/artists/:id', updateArtist);
app.delete('/artists/:id', deleteArtist);

// Song routes
app.get('/artists/:artistId/songs', listSongs);
app.post('/artists/:artistId/songs', createSong);
app.put('/artists/:artistId/songs/:songId', updateSong);
app.delete('/artists/:artistId/songs/:songId', deleteSong);
