const router = require("express").Router();

const {createItem,getItems,updateItem,deleteItem}=require('../controllers/clothingItems');

router.post('/', createItem)
router.get('/', getItems)
router.put('/:itemId/likes', updateItem)
router.delete('/:itemId/likes', deleteItem)


module.exports = router;