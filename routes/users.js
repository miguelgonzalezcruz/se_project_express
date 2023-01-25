/* eslint-disable comma-dangle */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, updateUser, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/me', auth, getUser);

router.patch(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
      // email: Joi.string().required().email(),
      // password: Joi.string().required().min(8),
      // _id: Joi.string().hex().alphanum().length(24),
    }),
  }),
  updateUser
);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      _id: Joi.string().hex().alphanum().length(24),
    }),
  }),
  createUser
);

module.exports = router;
