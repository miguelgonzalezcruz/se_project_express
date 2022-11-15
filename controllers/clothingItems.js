const clothingItem = require('../models/clothingItem');

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send({ message: 'No items found' });

        return;
      }

      res.send(data);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getItem = (req, res) => {
  clothingItem
    .findById(req.params.itemId)
    .orFail(() => {
      const error = new Error('No item found');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({
      name,
      weather,
      imageUrl,
      owner,
    })
    .then((data) => res.status(201).send(data))
    .catch((err) => res.status(400).send({ message: err.message }));
};

const deleteItem = (req, res) => {
  clothingItem
    .findByIdAndRemove(req.params.itemId)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'No item found' });

        return;
      }

      res.send(data);
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

const likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
    .orFail(() => {
      const error = new Error('No user found');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
    .orFail(() => {
      const error = new Error('No user found');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
  getItem,
};
