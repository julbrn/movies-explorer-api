require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const usersRoute = require('./routes/user');
const moviesRoute = require('./routes/movie');
const { NotFoundError } = require('./errors/notFoundError');
const { STATUS_MESSAGE } = require('./utils/STATUS_MESSAGE');
const { login, createUser } = require('./controllers/user');
//const { requestLogger, errorLogger } = require('./midlewares/logger');

const { PORT = 3000 } = process.env;
const { DATABASE__URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

mongoose.connect(DATABASE__URL, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

//app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', usersRoute);
app.use('/', moviesRoute);
app.use('/*', () => {
  throw new NotFoundError(STATUS_MESSAGE.PAGE_NOT_FOUND_MESSAGE);
});

//app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
