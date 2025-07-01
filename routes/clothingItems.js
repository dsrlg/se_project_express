const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  createItem,
  getItems,
  itemLike,
  deleteItem,
  deleteItemLike,
} = require("../controllers/clothingItems");

router.post("/", authMiddleware, createItem);
router.get("/",  getItems);
router.put("/:itemId/likes", authMiddleware, itemLike);
router.delete("/:itemId", authMiddleware, deleteItem);
router.delete("/:itemId/likes", authMiddleware, deleteItemLike);

module.exports = router;
