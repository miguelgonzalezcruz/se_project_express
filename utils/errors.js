const orFailError = () => {
  const error = new Error('No item found');
  error.statusCode = 404;
  throw error;
};

const badRequestError = (err, res) => {
  res.status(400).send({ message: 'Ouch! Invalid Input' });
};

const notFoundError = (err, res) => {
  res
    .status(404)
    .send({ message: 'Sorry, this is embarrasing. No item found' });
};

const errorHandling = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: err.message });

    return;
  }
  if (err.statusCode === 404) {
    res.status(err.statusCode).send({ message: err.message });

    return;
  }
  res.status(500).send({ message: err.message });
};

module.exports = {
  errorHandling,
  orFailError,
  badRequestError,
  notFoundError,
};
