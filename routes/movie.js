const router = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movie');
const { validateNewMovie, validateMovieId } = require('../middlewares/celebrate');

router.get('/movies', getMovies);
router.post('/movies', validateNewMovie, addMovie);
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;