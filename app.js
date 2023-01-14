/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandling = require('./middlewares/errorHandling');

const { createUser, login } = require('./controllers/users');

const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://localhost:27017/wtwr_db');

const app = express();

const allowedOrigins = [
  'https://around.nomoreparties.co',
  'http://around.nomoreparties.co',
  'http://localhost:3000',
];

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'), errorHandling);
app.use('/items', require('./routes/clothingItems'), errorHandling);

app.use(errorLogger);

app.use(errorHandling);

// app.use((err, req, res, next) => {
//   if (err.statusCode) {
//     res.status(err.statusCode).send({ message: err.message });
//   } else {
//     res.status(500).send({ message: 'An error occurred on the server' });
//   }
// });

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
