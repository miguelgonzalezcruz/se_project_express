/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable padded-blocks */
/* eslint-disable object-curly-newline */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = require('../utils/config');
const { errorHandling, orFailError } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => errorHandling(res));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      orFailError();
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  User.findOne({ email })
    .select('password')
    .then((user, err) => {
      if (user) {
        errorHandling(err, res);
      }
      return bcrypt.hash(req.body.password, 10).then((hash) => {
        User.create({ name, avatar, email, password: hash })
          .then((data) => res.status(201).send(data))
          .catch(() => {
            errorHandling(err, res);
          });
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

module.exports = { getUsers, getUser, createUser, login };
