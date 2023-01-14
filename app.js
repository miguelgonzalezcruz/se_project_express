/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/clothingItems'));

app.use(errorLogger); // enabling the error logger

// app.use(errors()); // celebrate error handler --> Es de Logging - Cómo se declara "errors"?

// app.use((req, res) => {
//   res.status(404).send({ message: 'Requested resource not found' });
// });

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  console.error(statusCode);
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

// app.use((err, req, res, next) => {
// --> No estoy seguro de que este sea correcto, revisar bien en el proyecto final
//   const { statusCode = 404, message } = err;
//   console.error(statusCode);
//   res.status(statusCode).send({
//     message: statusCode === 404 ? 'Sorry, this is embarrasing. No item found' : message,
//   });
// });

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
