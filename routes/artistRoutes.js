const express = require('express');
const { getArtists, createArtist, updateArtist, deleteArtist, getArtistSongs, importArtistsCSV, exportArtistsCSV } = require('../controllers/artistController');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/', getArtists);
router.post('/', createArtist);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);
router.get('/:id/songs', getArtistSongs);
router.post('/import', upload.single('file'), importArtistsCSV);
router.get('/export', exportArtistsCSV);

module.exports = router;
