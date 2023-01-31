const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRoute = require('./user');
const moviesRoute = require('./movie');
const { validateSignup, validateSignin } = require('../middlewares/celebrate');
const { login, createUser } = require('../controllers/user');
const { NotFoundError } = require('../errors/notFoundError');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);
router.use('/', auth, usersRoute);
router.use('/', auth, moviesRoute);
router.use('/*', auth, () => {
  throw new NotFoundError(STATUS_MESSAGE.PAGE_NOT_FOUND_MESSAGE);
});

module.exports = router;