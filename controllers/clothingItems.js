const clothingItem = require("../models/clothingItems");
const CODES = require("../utils/codes");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CODES.SUCCESS).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(CODES.BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(CODES.INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(CODES.INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server" });
    });
};

const itemLike = (req, res) => {
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
        res.status(CODES.BAD_REQUEST).send({ message: "Invalid item ID" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(CODES.NOT_FOUND).send({ message: "Item not found" });
      } else
        res
          .status(CODES.INTERNAL_SERVER)
          .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(CODES.SUCCESS).send({ itemId }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CODES.BAD_REQUEST).send({ message: "Invalid item ID" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(CODES.NOT_FOUND).send({ message: "Item not found" });
      } else
        res
          .status(CODES.INTERNAL_SERVER)
          .send({ message: "An error has occurred on the server" });
    });
};
const deleteItemLike = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(
      itemId,
      { $pull: { likes: req.user._id } }, // remove user ID from likes array
      { new: true }
    )
    .orFail()
    .then(() => res.status(CODES.SUCCESS).send({ itemId }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CODES.BAD_REQUEST).send({ message: "Invalid item ID" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(CODES.NOT_FOUND).send({ message: "Item not found" });
      } else
        res
          .status(CODES.INTERNAL_SERVER)
          .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createItem, getItems, itemLike, deleteItem, deleteItemLike };
