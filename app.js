const express = require('express');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const { getItems } = require('./controllers/clothingItems');
const auth = require('./middlewares/auth');

const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://localhost:27017/wtwr_db');

const app = express();

app.post('/signin', login);
app.post('/signup', createUser);
app.get('/', getItems);

app.use(auth);

app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/clothingItems'));

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
