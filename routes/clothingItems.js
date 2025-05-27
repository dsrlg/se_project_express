const router = require("express").Router();

const {createItem,getItems,itemLike,deleteItem,deleteItemLike}=require('../controllers/clothingItems');

router.post('/', createItem)
router.get('/', getItems)
router.put('/:itemId/likes', itemLike)
router.delete('/:itemId',deleteItem)
router.delete('/:itemId/likes', deleteItemLike)


module.exports = router;