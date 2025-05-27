const router = require("express").Router();
const CODES = require("../utils/codes");
const clothingItem = require('./clothingItems');

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req,res)=>{
  res.status(CODES.NOT_FOUND).send({message:"Router not found"})
})

module.exports=router;