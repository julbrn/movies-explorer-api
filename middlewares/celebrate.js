const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message(STATUS_MESSAGE.INVALID_URL);
};

const validateSignin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email({ tlds: {allow: false} }),
      password: Joi.string()
        .required(),
    }),
});

const validateSignup = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email({ tlds: {allow: false} }),
      password: Joi.string()
        .required(),
    }),
});

const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: {allow: false} }),
  }),
});

const validateNewMovie = celebrate({
  body: Joi.object().keys({
    nameRU: Joi
      .string()
      .required(),
    nameEN: Joi
      .string()
      .required(),
    country: Joi
      .string()
      .required(),
    director: Joi
      .string()
      .required(),
    duration: Joi
      .number()
      .required(),
    year: Joi
      .string()
      .required()
      .length(4),
    description: Joi
      .string()
      .required(),
    image: Joi
      .string()
      .required()
      .custom(validateURL),
    trailerLink: Joi
      .string()
      .required()
      .custom(validateURL),
    thumbnail: Joi
      .string()
      .custom(validateURL)
      .required(),
    movieId: Joi
      .number()
      .required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateProfileUpdate,
  validateNewMovie,
  validateMovieId,
};