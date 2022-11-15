const User = require('../models/user');
const handleErrors = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send({ message: 'No users found' });

        return;
      }

      res.send(data);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('No user found');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((data) => res.status(201).send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = { getUsers, getUser, createUser };
