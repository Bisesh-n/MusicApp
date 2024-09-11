const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('Artist', ArtistSchema);
