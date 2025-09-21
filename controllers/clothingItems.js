const clothingItem = require("../models/clothingItems");
const CODES = require("../utils/codes");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-err");
const InternalServerError = require("../errors/internal-server-error");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CODES.SUCCESS).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      }
      next(new InternalServerError("An error has occurred on the server"));
    });
};

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      next(new InternalServerError("An error has occurred on the server"));
    });
};

const itemLike = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } }, // add user ID to likes array
      { new: true }
    )
    .orFail()
    .then((item) => res.status(CODES.SUCCESS).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      next(new InternalServerError("An error has occurred on the server"));
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(CODES.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }
      return item.deleteOne().then(() => {
        res
          .status(CODES.SUCCESS)
          .send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      next(new InternalServerError("An error has occurred on the server"));
    });
};
const deleteItemLike = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then(() => res.status(CODES.SUCCESS).send({ itemId }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      next(new InternalServerError("An error has occurred on the server"));
    });
};

module.exports = { createItem, getItems, itemLike, deleteItem, deleteItemLike };
