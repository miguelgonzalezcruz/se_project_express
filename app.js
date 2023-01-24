/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandling = require('./middlewares/errorHandling');

const { createUser, login } = require('./controllers/users');

const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://localhost:27017/wtwr_db');

const app = express();

const allowedOrigins = [
  'https://wtwrmgc.students.nomoredomainssbs.ru',
  'http://wtwrmgc.students.nomoredomainssbs.ru',
  'http://localhost:3000',
];

app.use(cors({ origin: allowedOrigins }));

// app.use(limiter);

// app.use(helmet());

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'), errorHandling);
app.use('/items', require('./routes/clothingItems'), errorHandling);

app.use(errorLogger);

app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
