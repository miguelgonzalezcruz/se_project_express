/* eslint-disable comma-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const clothingItem = require('../models/clothingItem');
const { NotFoundError } = require('../middlewares/errorHandling');
const { ConflictError } = require('../middlewares/errorHandling');

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const getItem = (req, res, next) => {
  clothingItem
    .findById(req.params.itemId)
    .orFail(() => {
      throw new NotFoundError('Item not found');
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({
      name,
      weather,
      imageUrl,
      owner,
    })
    .orFail(() => {
      throw new ConflictError('Test text');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await clothingItem.findById(req.params.itemId).orFail(() => {
      throw new NotFoundError('Item not found');
    });
    if (item.owner.equals(req.user._id)) {
      await item.remove();
      return res.send({ clothingItem: item });
    }
    res
      .status(403)
      .send({ message: 'Insufficient permissions to delete item' });
  } catch (err) {
    next(err);
  }
};

const likeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new NotFoundError('Item not found');
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new NotFoundError('Item not found');
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
  getItem,
};
// const createItem = (req, res) => {
//   const { name, weather, imageUrl } = req.body;
//   const owner = req.user._id;

//   clothingItem
//     .create({
//       name,
//       weather,
//       imageUrl,
//       owner,
//     })
//     .then((data) => res.status(201).send(data))
//     .catch(next);
// };
// const deleteItem = (req, res) => {
//   clothingItem
//     .findById(req.params.itemId)
//     .orFail(() => {
//       orFailError();
//     })
//     .then((item) => {
//       if (item.owner.equals(req.user._id)) {
//         return item.remove(() => res.send({ clothingItem: item }));
//       }
//       return res
//         .status(403)
//         .send({ message: 'Insuffient permissions to delete item' });
//     })
//     .catch((err) => {
//       errorHandling(err, res);
//     });
// };
// const likeItem = (req, res) => {
//   clothingItem
//     .findByIdAndUpdate(
//       req.params.itemId,
//       { $addToSet: { likes: req.user._id } },
//       // eslint-disable-next-line comma-dangle
//       { new: true }
//     )
//     .orFail(() => {
//       orFailError();
//     })
//     .then((data) => {
//       res.status(200).send(data);
//     })
//     .catch((err) => {
//       errorHandling(err, res);
//     });
// };
// const likeItem = (req, res) => {
//   clothingItem
//     .findByIdAndUpdate(
//       req.params.itemId,
//       { $addToSet: { likes: req.user._id } },
//       // eslint-disable-next-line comma-dangle
//       { new: true }
//     )
//     .orFail(() => {
//       orFailError();
//     })
//     .then((data) => {
//       res.status(200).send(data);
//     })
//     .catch((err) => {
//       errorHandling(err, res);
//     });
// }
