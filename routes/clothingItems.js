const router = require('express').Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
  getItem,
} = require('../controllers/clothingItems');

router.get('/', getItems);
router.post('/', createItem);
router.delete('/:itemId', deleteItem);
router.get('/:itemId', getItem);
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;
