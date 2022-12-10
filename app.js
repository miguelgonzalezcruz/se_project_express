const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const { createUser, login } = require('./controllers/users');

const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://localhost:27017/wtwr_db');

const app = express();

app.use(express.json());

const allowedOrigins = [
  'https://around.nomoreparties.co',
  'http://around.nomoreparties.co',
  'http://localhost:3000',
];
app.use(cors({ origin: allowedOrigins }));

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/clothingItems'));

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
