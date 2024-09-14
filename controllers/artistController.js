const Artist = require('../models/artist');
const Song = require('../models/song');
const csv = require('csv-parser');
const fs = require('fs');

exports.getArtists = async (req, res) => {
    try {
        // Fetch all artists
        const artists = await Artist.find();

        // For each artist, fetch their related songs and include timestamps
        const artistsWithSongs = await Promise.all(artists.map(async artist => {
            const songs = await Song.find({ artist: artist._id });
            return {
                ...artist._doc,  // Spread artist data
                songs,           // Attach related songs
                createdAt: artist.createdAt, // Include artist timestamps
                updatedAt: artist.updatedAt
            };
        }));

        // Return the artists with their related songs and timestamps
        res.status(200).json(artistsWithSongs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.createArtist = async (req, res) => {
  try {
    const artist = new Artist(req.body);
    await artist.save();
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(artist);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    await Artist.findByIdAndDelete(req.params.id);
    res.send('Artist deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getArtistSongs = async (req, res) => {
  try {
    const songs = await Song.find({ artist: req.params.id });
    res.json(songs);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.importArtistsCSV = async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const result of results) {
          await new Artist(result).save();
        }
        res.send('Artists imported');
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.exportArtistsCSV = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.csv(artists, true);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
