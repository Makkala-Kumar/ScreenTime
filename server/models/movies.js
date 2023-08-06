const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    name:{
        type: String,
        required: 'This Field is required.'
    },
    image:{
        type: String,
        required: 'This Field is required.'
    },
    description:{
        type: String,
    },
    release:{
        type: Array,
        required: 'This Field is required.'
    },
    rating:{
        type: String,
        required: 'This Field is required.'
    },
    category:{
        type: String,
        enum: ['Marvel', 'Action', 'Telugu', 'TopMovies', 'Hindi', 'Hollywood', 'Shows'],
        required: 'This Field is required.'
    },
    imdb: {
        type: String,
    },
    ott: {
        type: String,
    } 
});

moviesSchema.index({ name: 'text', description: 'text' });

//WildCard
//moviesSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('movies', moviesSchema);