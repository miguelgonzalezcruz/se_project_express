const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://localhost:27017/wtwr_db');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6371eceb5f38f2d1e505b76f',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/clothingItems'));

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
