require('../models/database');
const movies = require('../models/movies');
const Movie = require('../models/movies');
const User = require('../models/user');

/**
 * GET/ 
 * Hompage movies in different genre
 */
exports.homepage = async (req, res) => {
    try {
        //no. of movies should be displayed on homepage
        const limitnumber = 6;

        const marvel = await movies.find({ 'category': 'Marvel' }).limit(limitnumber);
        const telugu = await movies.find({ 'category': 'Telugu' }).limit(limitnumber);
        const hindi = await movies.find({ 'category': 'Hindi' }).limit(limitnumber);
        const hollywood = await movies.find({ 'category': 'Hollywood' }).limit(limitnumber);
        const topMovies = await movies.find({ 'category': 'TopMovies' }).limit(limitnumber);
        const action = await movies.find({ 'category': 'Action' }).limit(limitnumber);

        //using different types of movies to ejs templates
        const allMovies = { marvel, telugu, hindi, hollywood, topMovies, action };

        //logged in or logged out
        const isLoggedIn = req.session.isLoggedIn || true;

        res.render('index', { title: 'ScreenTime - Homepage', allMovies, isLoggedIn: res.locals.isLoggedIn });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
};


/**
 * GET/ Movies
 * All Category Movies (view more)
 */
exports.viewMoreMovies = async (req, res) => {
    try {
        const limitnumber = 50;

        const marvel = await movies.find({ 'category': 'Marvel' }).limit(limitnumber);
        const telugu = await movies.find({ 'category': 'Telugu' }).limit(limitnumber);
        const hindi = await movies.find({ 'category': 'Hindi' }).limit(limitnumber);
        const hollywood = await movies.find({ 'category': 'Hollywood' }).limit(limitnumber);
        const topMovies = await movies.find({ 'category': 'TopMovies' }).limit(limitnumber);
        const action = await movies.find({ 'category': 'Action' }).limit(limitnumber);

        const allMovies = { marvel, telugu, hindi, hollywood, topMovies, action };

        const category = req.query.action || 'all'; // Using 'action' instead of 'category'

        if (category === 'all') {
            res.render('viewMore', { title: 'ScreenTime - More Movies', allMovies, category });
        } else if (category === 'action') {
            res.render('viewMore', { title: 'ScreenTime - Action Movies', allMovies, category });
        } else if (category === 'marvel') {
            res.render('viewMore', { title: 'ScreenTime - Marvel Movies', allMovies, category });
        } else if (category === 'topMovies') {
            res.render('viewMore', { title: 'ScreenTime - Top Movies', allMovies, category });
        } else if (category === 'telugu') {
            res.render('viewMore', { title: 'ScreenTime - Telugu Movies', allMovies, category });
        } else {
            res.status(404).send('Page not found');
        }

    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
};



/**
 * GET/ Movies/:Id
 * Individual movies
 */

exports.exploreMovies = async (req, res) => {
    try {

        let movieId = req.params.id;

        const movies = await Movie.findById(movieId);
        res.render('movies', { title: 'ScreenTime - Movie', movies });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
}


/**
 * GET/ signUp
 */

exports.signUp1 = async (req, res) => {

    res.render('signUp', { title: 'ScreenTime - SignUp' });
}


/**
 * POST/ signUp 
 */
exports.signUp2 = async (req, res) => {

    const { username, email, password, confirmPassword } = req.body;

    try {
        //checking passwords
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        //same username or email already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).send('User already exists with this email or username');
        }

        //Creating new user
        const newUser = new User({ username, email, password });
        await newUser.save(); //saving to database

        res.redirect('/login');
    }
    catch (error) {
        res.status(500).send({ message: error.message || 'Error' });
    }
};



/**
 * GET/ Login
 */

exports.login1 = async (req, res) => {

    res.render('login', { title: 'ScreenTime - Login' });
}



/**
 * POST/ login
 */

exports.login2 = async (req, res) => {

    const { usernameOrEmail, password } = req.body;

    try {
        //finding user in database
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });

        //if user exists or not
        if (!user || user.password !== password) {
            return res.status(401).send('Invalid username or password');
        }

        //Set the user ID in the session
        req.session.userId = user._id;

        req.session.isLoggedIn = true;
        res.redirect('/');
    }
    catch (error) {
        res.status(500).send({ message: error.message || 'Error Occured' });
    }
};


/**
 * GET/ Logout
 */
exports.logout1 = (req, res) => {
    // Destroy the user's session to log them out
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
};


/**
 * GET/ Profile
 */
exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
            .populate('watchlist.movie')
            .populate('favorites.movie');

        if (!user) {
            return res.status(404).send('Please Login First');
        }

        res.render('profile', { title: 'ScreenTime - Profile', user });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
};

 

/**
 * POST/ Search Bar and working
 */
exports.search = async (req, res) => {

    //searchTerm
    try {
        let searchTerm = req.body.searchTerm;
        let movies = await Movie.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });

        res.render('search', { title: 'ScreenTime - Search', movies: movies });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}


// POST/ To Profile: Add to Watchlist
exports.addToWatchList = async (req, res) => {
    try {
      const movieIdToAdd = req.params.id;
      const { status, rating } = req.body;
  
      console.log('Status:', status);
      console.log('Rating:', rating);
  
      // Find the current user based on the session user ID
      const user = await User.findById(req.session.userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      
      if (!Array.isArray(user.watchlist)) {
        user.watchlist = [];
      }
  
      // Check if the movie is already in the watchlist
      const watchlistItemIndex = user.watchlist.findIndex(item => item.movie.equals(movieIdToAdd));
  
      if (watchlistItemIndex !== -1) {
        // If the movie is already in the watchlist, update the status and user rating
        user.watchlist[watchlistItemIndex].status = status;
        user.watchlist[watchlistItemIndex].userRating = rating;
        console.log('Watchlist Item Updated:', user.watchlist[watchlistItemIndex]);
      } else {
        // If the movie is not in the watchlist, add it with the provided status and user rating
        const movie = await Movie.findById(movieIdToAdd);
        if (!movie) {
          return res.status(404).send('Movie not found');
        }
  
        console.log('Movie Found:', movie);
  
        user.watchlist.push({
          movie: movie,
          status: status,
          userRating: rating,
        });
  
        console.log('Watchlist Item Added:', user.watchlist[user.watchlist.length - 1]);
      }
  
      await user.save();
  
      res.redirect('/profile'); // Redirect back to the profile page after updating the watchlist
    } catch (error) {
      res.status(500).send({ message: error.message || 'Error Occurred' });
    }
  };
  
  //Post to Favorites
  exports.addToFavorites = async (req, res) => {
    try {
      const movieIdToAdd = req.params.id;
  
      // Find the current user based on the session user ID
      const user = await User.findById(req.session.userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Check if the movie is already in the favorites list
      const favoritesItemIndex = user.favorites.findIndex(item => item.movie.equals(movieIdToAdd));
  
      if (favoritesItemIndex !== -1) {
        console.log('Movie is already in Favorites:', user.favorites[favoritesItemIndex]);
      } else {
        // If the movie is not in the favorites list, add it to the list
        const movie = await Movie.findById(movieIdToAdd);
        if (!movie) {
          return res.status(404).send('Movie not found');
        }
  
        console.log('Movie Found:', movie);
  
        user.favorites.push({
          movie: movie,
          status: 'Favorite', // Set as favorite
          userRating: null, // Set default user rating
        });
  
        console.log('Movie Added to Favorites:', user.favorites[user.favorites.length - 1]);
      }
  
      await user.save();
  
      res.redirect('/profile'); // Redirect back to the profile page after updating the favorites
  
    } catch (error) {
      res.status(500).send({ message: error.message || 'Error Occurred' });
    }
  };
  
