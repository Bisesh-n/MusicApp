const express = require('express');
const { createSong, updateSong, deleteSong } = require('../controllers/songController');
const router = express.Router();

router.post('/', createSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

module.exports = router;
