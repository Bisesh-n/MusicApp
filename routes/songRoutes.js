const express = require('express');
const { getSongsByArtist, createSong, updateSong, deleteSong } = require('../controllers/songController');
const router = express.Router();

router.get('/artist/:artistId', getSongsByArtist);
router.post('/', createSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

module.exports = router;
