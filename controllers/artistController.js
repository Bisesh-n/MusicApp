const Artist = require('../models/artist');
const Song = require('../models/song');
const stringify = require('csv-stringify');
// const { parse } = require('json2csv');
const fs = require('fs');

exports.getArtists = async (req, res) => {
    try {
        // Fetch all artists
        const artists = await Artist.find().sort({ updatedAt: -1 });

        // For each artist, fetch their related songs and include timestamps
        const artistsWithSongs = await Promise.all(artists.map(async artist => {
            const songs = await Song.find({ artist: artist._id });
            return {
                ...artist._doc,  // artist data
                songs,           // related songs
                createdAt: artist.createdAt, //  artist timestamps
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



// exports.deleteArtist = async (req, res) => {
//   try {
//     await Artist.findByIdAndDelete(req.params.id);
//     res.send('Artist deleted');
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };
exports.deleteArtist = async (req, res) => {
  try {
      const artistId = req.params.id;

      // Find and delete all songs related to the artist
      await Song.deleteMany({ artist: artistId });

      // Then delete the artist
      const result = await Artist.findByIdAndDelete(artistId);

      if (!result) {
          return res.status(404).json({ msg: 'Artist not found' });
      }

      res.status(200).json({ msg: 'Artist and related songs deleted successfully' });
  } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
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



exports.exportArtistsCSV = async (req, res) => {
  const artistId = req.params.artistId;

    try {
        // Find artist and populate with songs
        const artist = await Artist.findById(artistId).populate('songs').exec();

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        console.log('Artist Data:', artist);
        console.log('Songs Data:', artist.songs);

        // Check if song exists
        const songs = artist.songs;
        if (!songs || songs.length === 0) {
            return res.status(404).json({ message: 'No song found for this artist' });
        }

        const csvData = songs.map(song => ({
            artistName: artist.name,
            artistDOB: artist.dob,
            artistGender: artist.gender,
            artistAddress: artist.address,
            artistFirstReleaseYear: artist.first_release_year,
            artistNoOfAlbumsReleased: artist.no_of_albums_released,
            songTitle: song.title || 'N/A',
            songAlbum: song.album || 'N/A',
            songYear: song.year || 'N/A',
            songGenre: song.genre || 'N/A',
            artistCreatedAt: artist.createdAt,
            artistUpdatedAt: artist.updatedAt,
            songCreatedAt: song.createdAt,
            songUpdatedAt: song.updatedAt
        }));

        const csvHeaders = [
            'artistName', 'artistDOB', 'artistGender', 'artistAddress', 
            'artistFirstReleaseYear', 'artistNoOfAlbumsReleased', 
            'songTitle', 'songAlbum', 'songYear', 'songGenre',
            'artistCreatedAt', 'artistUpdatedAt', 'songCreatedAt', 'songUpdatedAt'
        ];


        // Use csv-stringify to generate CSV
        stringify(csvData, { header: true, columns: csvHeaders }, (err, output) => {
            if (err) {
                console.error('Error exporting artist to CSV:', err);
                return res.status(500).json({ message: 'Error exporting artist to CSV' });
            }
            res.header('Content-Type', 'text/csv');
            res.attachment('artist_songs.csv');
            res.send(output);
        });

        
    } catch (error) {
        console.error('Error exporting artist to CSV:', error);
        res.status(500).json({ message: 'Error exporting artist to CSV' });
    }
};



// exports.importArtistsCSV = async (req, res) => {
//     try {
//       const results = [];
//       fs.createReadStream(req.file.path)
//         .pipe(csv())
//         .on('data', (data) => results.push(data))
//         .on('end', async () => {
//           for (const result of results) {
//             await new Artist(result).save();
//           }
//           res.send('Artists imported');
//         });
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   };