const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://localhost:27017/wtwr_db');

const app = express();

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
