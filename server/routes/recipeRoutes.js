const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App ROUTES
 */

router.get('/', recipeController.homepage);
router.get('/movies/:id', recipeController.exploreMovies);
router.get('/movies', recipeController.viewMoreMovies);
router.get('/signUp', recipeController.signUp1);
router.post('/signUp', recipeController.signUp2);
router.get('/login', recipeController.login1);
router.post('/login', recipeController.login2);
router.get('/logout', recipeController.logout1);
router.get('/profile', recipeController.profile);
router.post('/search', recipeController.search);
router.post('/profile/watchlist/:id', recipeController.addToWatchList);
router.post('/profile/favorites/:id', recipeController.addToFavorites);


module.exports = router;