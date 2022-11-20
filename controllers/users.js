/* eslint-disable operator-linebreak */
/* eslint-disable padded-blocks */
/* eslint-disable object-curly-newline */
const bcrypt = require('bcryptjs');
const User = require('../models/user');
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
    .then((user, err) => {
      if (user) {
        return errorHandling(err, res);
      }
      return bcrypt.hash(req.body.password, 10).then((hash) => {
        User.create({
          name: name || 'Elise Bouer',
          avatar:
            avatar ||
            'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png',
          email: email || '',
          password: hash,
        });
      });
    })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      errorHandling(err, res);
    });
};

module.exports = { getUsers, getUser, createUser };
