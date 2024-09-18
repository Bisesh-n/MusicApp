const express = require('express');
const { getSongsByArtist, getAllSongs, getSongById, createSong, updateSong, deleteSong } = require('../controllers/songController');
const router = express.Router();

router.get('/artist/:artistId', getSongsByArtist);
router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.post('/', createSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

module.exports = router;
