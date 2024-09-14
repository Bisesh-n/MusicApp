const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },

  album: {
    type: String,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  genre: { 
    type: String,
    required: true
  },

  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artist', 
    required: true 
  }
},
{ timestamps: true });

module.exports = mongoose.model('Song', SongSchema);
