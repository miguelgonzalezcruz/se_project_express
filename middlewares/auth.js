const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
// const { errorHandling } = require('../utils/errors');

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     errorHandling(null, res, 401, 'Authorization required');
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     errorHandling(err, res);
//   }
//   req.user = payload;
//   return next();
// };

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authorization required' });
    // errorHandling(res, 401, 'Authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Authorization required' });
    // errorHandling(res, 401, 'Authorization required');
  }
  req.user = payload;
  return next();
};
