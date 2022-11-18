/* eslint-disable operator-linebreak */
const errorHandling = (err, res) => {
  if (
    err.statusCode === 400 ||
    err.name === 'ValidationError' ||
    err.name === 'CastError'
  ) {
    res.status(err.statusCode).send({ message: 'Ouch! Invalid Input' });

    return;
  }
  if (err.statusCode === 404) {
    res
      .status(err.statusCode)
      .send({ message: 'Sorry, this is embarrasing. No item found' });

    return;
  }
  res
    .status(500)
    .send({ message: 'Ups! An error has occurred on the server.' });
};

const orFailError = () => {
  const error = new Error('No item found');
  error.statusCode = 404;
  throw error;
};

const errorDefault = (err, res) => {
  res
    .status(500)
    .send({ message: 'Ups! An error has occurred on the server.' });
};

const badRequestError = (err, res) => {
  res.status(400).send({ message: 'Ouch! Invalid Input' });
};

const notFoundError = (err, res) => {
  res
    .status(404)
    .send({ message: 'Sorry, this is embarrasing. No item found' });
};

const errorCodes = {
  badRequest: 400,
  notFound: 404,
  defaultError: 500,
};

module.exports = {
  errorHandling,
  errorDefault,
  orFailError,
  badRequestError,
  notFoundError,
  errorCodes,
};
