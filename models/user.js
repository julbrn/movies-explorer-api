const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');
const { UnauthorizedError } = require('../errors/unauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    trim: true,
    default: 'Анонимный пользователь',
  },
  email: {
    validate: {
      validator(email) {
        return isEmail(email);
      },
      message: 'Некорректный формат email',
    },
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    trim: true,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(STATUS_MESSAGE.WRONG_LOGIN_DATA_MESSAGE));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(STATUS_MESSAGE.WRONG_LOGIN_DATA_MESSAGE));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
