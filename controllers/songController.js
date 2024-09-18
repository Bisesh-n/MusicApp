const Song = require('../models/song');

exports.getSongsByArtist = async (req, res) => {
  try {
      const artistId = req.params.artistId;
      const songs = await Song.find({ artist: artistId });  // Find songs for this artist

      res.status(200).json(songs);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
  }
};


exports.getSongById = async (req, res) => {
  try {
      const songId = req.params.id;

      // Find the song by ID and populate the 'artist' field
      const song = await Song.findById(songId).populate('artist', 'name'); // Populating only the artist's name

      if (!song) {
          return res.status(404).json({ msg: 'Song not found' });
      }

      res.status(200).json(song);
  } catch (error) {
      console.error('Error fetching song:', error);
      res.status(500).json({ msg: 'Server error' });
  }
};


exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ updatedAt: -1 }).populate('artist', 'name'); // Populate artist name
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.createSong = async (req, res) => {
  try {
      const { title, album, year, genre, artist } = req.body;

      if (!title || !artist || !year) {
          return res.status(400).json({ msg: 'Please provide all required fields (title, album, year, genre, artist)' });
      }

      const newSong = new Song({
          title,
          album,
          year,
          genre,
          artist
      });

      await newSong.save();
      res.json(newSong);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};

exports.updateSong = async (req, res) => {
  const { title, album, year, genre } = req.body;

  try {
      let song = await Song.findById(req.params.id);

      if (!song) {
          return res.status(404).json({ msg: 'Song not found' });
      }

      // Update song fields
      song.title = title || song.title;
      song.album = album || song.album;
      song.year = year || song.year;
      song.genre = genre || song.genre;
      song.updatedAt = Date.now();

      await song.save();
      res.json(song);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};


exports.deleteSong = async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.send('Song deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
