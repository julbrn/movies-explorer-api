const rateLimit = require('express-rate-limit');
const { STATUS_MESSAGE } = require('./STATUS_MESSAGE');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    "message": STATUS_MESSAGE.TOO_MANY_REQUESTS
  }
  ,
});

module.exports = limiter;