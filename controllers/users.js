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
const { NotFoundError } = require('../errors/not-found-err');
const { ConflictError } = require('../errors/conflict-err');

const { JWT_SECRET } = require('../utils/config');

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail(() => {
      throw new NotFoundError('Item not found');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new ConflictError('Email already exists');
        return next(error);
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
          .catch((err) => {
            next(err);
          });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    res.send({
      token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
    });
  } catch (err) {
    next(new NotFoundError('User not found'));
  }
};

module.exports = { getUsers, getUser, createUser, login, updateUser };

// const updateUser = (req, res) => {
//   const { name, avatar } = req.body;
//   User.findByIdAndUpdate(
//     { _id: req.user._id },
//     { name, avatar },
//     { new: true, runValidators: true }
//   )
//     .orFail(() => {
//       orFailError();
//     })
//     .then((user) => {
//       res.status(200).send(user);
//     })
//     .catch((err) => {
//       errorHandling(err, res);
//     });
// };

// const login = (req, res) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       res.send({
//         token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
//       });
//     })
//     .catch((err) => {
//       errorHandling(err, res);
//     });
// };
//* ---------------- */
// const login = (req, res, next) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//   .then((user) => {
//   res.send({
//   token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
//   });
//   })
//   .catch((err) => {
//   next(new NotFoundError('User not found'));
//   });
//   };
//* ---------------- */
// const createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;
//   User.findOne({ email }).then((user, err) => {
//     if (err) {
//       return res.status(500).send({ message: 'Server error' });
//     }
//     if (user) {
//       return res.status(409).send({ message: 'Email already exists' });
//     }
//     return bcrypt.hash(password, 10).then((hash) => {
//       User.create({ name, avatar, email, password: hash })
//         .then((data) =>
//           res.setHeader('Content-Type', 'application/json').status(201).send({
//             name: data.name,
//             avatar: data.avatar,
//             email: data.email,
//           })
//         )
//         .catch(() => {
//           errorHandling(err, res);
//         });
//     });
//   });
// };
//* ---------------- */
// const updateUser = (req, res, next) => {
//   const { name, avatar } = req.body;
//   User.findByIdAndUpdate(
//     { _id: req.user._id },
//     { name, avatar },
//     { new: true, runValidators: true }
//   )
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('User not found');
//       }

//       res.status(200).send(user);
//     })
//     .catch(next);
// };
