const router = require('express').Router();

const { getItems } = require('../controllers/clothingItems');
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

router.get('/', getItems);

const auth = require('../middlewares/auth');

router.post('/', auth, createItem);
router.delete('/:itemId', auth, deleteItem);
router.put('/:itemId/likes', auth, likeItem);
router.delete('/:itemId/likes', auth, dislikeItem);

module.exports = router;
