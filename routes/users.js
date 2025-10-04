const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { updateUser, getCurrentUser } = require("../controllers/users");
const { validateUserProfile } = require("../middlewares/validation");

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, validateUserProfile, updateUser);
module.exports = router;
