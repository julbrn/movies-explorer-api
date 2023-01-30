const Movie = require('../models/movie');
const { NotFoundError } = require('../errors/notFoundError');
const { ForbiddenError } = require('../errors/forbiddenError');
const { BadRequestError } = require('../errors/badRequestError');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

const getMovies = (req, res, next) => Movie.find({ owner: req.user._id })
  .then((movies) => res.send(movies))
  .catch(next);

const addMovie = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(STATUS_MESSAGE.NONEXISTENT_MOVIE_MESSAGE);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(STATUS_MESSAGE.UNAUTHORIZED_MOVIE_DELETION_MESSAGE);
      }
      return movie.remove()
        .then(() => {
          res.send({ data: movie });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies, addMovie, deleteMovie,
};