const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createUser, login } = require('./controllers/users');

const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://localhost:27017/wtwr_db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.post('/signin', login);
app.post('/signup', createUser);

app.use(express.json());
app.use(cors());

app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/clothingItems'));

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
