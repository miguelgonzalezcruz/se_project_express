const clothingItem = require('../models/clothingItem');

const {
  errorHandling,
  errorDefault,
  orFailError,
  badRequestError,
} = require('../utils/errors');

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => errorDefault(res, err));
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
      badRequestError(err, res);
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
    .findByIdAndRemove(req.params.itemId)
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
