const { NODE_ENV, SECRET_KEY } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/notFoundError');
const { BadRequestError } = require('../errors/badRequestError');
const { ConflictError } = require('../errors/conflictError');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(STATUS_MESSAGE.NONEXISTENT_USER_MESSAGE))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => res.status(201).send({
      data: {
        _id: user._id,
        name,
        email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(STATUS_MESSAGE.CONFLICT_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE));
      } else next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError(STATUS_MESSAGE.NONEXISTENT_USER_MESSAGE))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(STATUS_MESSAGE.NONEXISTENT_USER_MESSAGE);
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(STATUS_MESSAGE.WRONG_ID_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUserById, createUser, updateProfile, login, getUserInfo,
};