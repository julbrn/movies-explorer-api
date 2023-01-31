require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const limiter = require('./utils/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const { DATABASE__URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(cors({
  origin: ['https://julbrndiploma.nomoredomainsclub.ru', 'http://julbrndiploma.nomoredomainsclub.ru', 'https://api.julbrndiploma.nomoredomainsclub.ru', 'http://api.julbrndiploma.nomoredomainsclub.ru', 'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'localhost:3000',
  ],
  credentials: true,
}));

mongoose.connect(DATABASE__URL, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
