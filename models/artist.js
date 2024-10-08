const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    first_release_year:{
        type: Number,
        required: true
    },
    no_of_albums_released:{
        type: Number,
        required: true
    },
    songs:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Song'
      }
}, { timestamps: true });  // Enable timestamps

module.exports = mongoose.model('Artist', ArtistSchema);
