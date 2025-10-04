const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");

const { loginUser, createUser } = require("../controllers/users");
const { validateLogin, validateSignup } = require("../middlewares/validation");
const NOT_FOUND = require("../errors/not-found-error");

router.post("/signin", validateLogin, loginUser);
router.post("/signup", validateSignup, createUser);
router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res, next) => {
  next(new NOT_FOUND("Requested resource not found"));
});

module.exports = router;
