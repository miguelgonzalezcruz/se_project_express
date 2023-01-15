/* eslint-disable comma-dangle */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const { getItems } = require('../controllers/clothingItems');
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

router.get('/', getItems);

// router.post('/', auth, createItem);
router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      weather: Joi.string().required(),
      imageUrl: Joi.string().required().uri(),
    }),
  }),
  createItem
);
router.delete('/:itemId', auth, deleteItem);
router.put('/:itemId/likes', auth, likeItem);
router.delete('/:itemId/likes', auth, dislikeItem);

module.exports = router;
