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
    .catch((err) => res.status(500).send({ message: err.message }));
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
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = { getItems, createItem, deleteItem };
