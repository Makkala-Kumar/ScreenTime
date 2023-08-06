//User Model database

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  watchlist: [{
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'movies' },
    status: { type: String, enum: ['Watching', 'Dropped', 'Completed', 'Plan to Watch', ] },
    userRating: { type: Number, min: 1, max: 10 },
  }],

  favorites: [{
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'movies' },
    status: { type: String, enum: ['Favorite'] },
    userRating: { type: Number, min: 1, max: 10 },
}],

});

module.exports = mongoose.model('User', userSchema);
