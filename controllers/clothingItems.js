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
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(CODES.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }
      return item.deleteOne().then(() => {
        res.status(CODES.SUCCESS).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      console.error(err);
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
    .findById(
      itemId
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
