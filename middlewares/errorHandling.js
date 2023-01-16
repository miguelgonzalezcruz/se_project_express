/* eslint-disable no-unused-vars */
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-error');
const BadRequestError = require('../errors/bad-request-err');

module.exports = (err, req, res, next) => {
  console.error(err);
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: 'Not found' });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  if (err instanceof BadRequestError) {
    return res.status(400).send({ message: 'Bad request' });
  }
  return res.status(500).send({ message: 'An error occurred on the server' });
};
