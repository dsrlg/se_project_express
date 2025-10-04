const router = require("express").Router();
const {validateItem,validateItemId}        = require("../middlewares/validation");
const authMiddleware = require("../middlewares/auth");
const {
  createItem,
  getItems,
  itemLike,
  deleteItem,
  deleteItemLike,
} = require("../controllers/clothingItems");

router.post("/", authMiddleware, validateItem, createItem);
router.get("/", getItems);
router.put("/:itemId/likes", authMiddleware, validateItemId, itemLike);
router.delete("/:itemId", authMiddleware, validateItemId, deleteItem);
router.delete("/:itemId/likes", authMiddleware, validateItemId, deleteItemLike);
module.exports = router;
