/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const clothingItem = require('../models/clothingItem');

const { errorHandling, defaultError, orFailError } = require('../utils/errors');

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => defaultError(res, err));
};

const getItem = (req, res) => {
  clothingItem
    .findById(req.params.itemId)
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
    .catch((err) => {
      errorHandling(err, res);
    });
};

const deleteItem = (req, res) => {
  clothingItem
    .findById(req.params.itemId)
    .orFail(() => {
      orFailError();
    })
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        return item.remove(() => res.send({ clothingItem: item }));
      }
      return res
        .status(403)
        .send({ message: 'Insuffient permissions to delete item' });
    })
    .catch((err) => {
      errorHandling(err, res);
    });
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
      orFailError();
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
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
      orFailError();
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
  getItem,
};
