const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { errorHandling } = require('../utils/errors');

module.exports = {req, res, next} => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    errorHandling(res, 401, 'Authorization required');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    errorHandling(res, 401, 'Authorization required');
  }
  req.user = payload;
  next();
};