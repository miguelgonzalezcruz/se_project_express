/* eslint-disable arrow-parens */
/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable brace-style */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable padded-blocks */
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
  User.findById({ _id: req.user._id })
    .orFail(() => {
      orFailError();
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      orFailError();
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email }).then((user, err) => {
    if (err) {
      return res.status(500).send({ message: 'Server error' });
    }
    if (user) {
      return res.status(409).send({ message: 'Email already exists' });
    }
    return bcrypt.hash(password, 10).then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((data) =>
          res.setHeader('Content-Type', 'application/json').status(201).send({
            name: data.name,
            avatar: data.avatar,
            email: data.email,
          })
        )
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
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

module.exports = { getUsers, getUser, createUser, login, updateUser };
