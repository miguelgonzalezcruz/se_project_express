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

const errorDefault = (err, res) => {
  res.status(500).send({ message: 'Sorry, something went wrong' });
};

const errorHandling = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    notFoundError(err, res);

    return;
  }
  if (err.statusCode === 404) {
    notFoundError(err, res);

    return;
  }
  res.status(500).errorDefault(res, err);
};

module.exports = {
  errorHandling,
  orFailError,
  badRequestError,
  notFoundError,
  errorDefault,
};
