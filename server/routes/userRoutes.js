
const express = require("express");
const { signup, login, changeMyPassword } = require("../controllers/authController");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const router = express.Router()


router.post("/signup", signup)
router.post("/login", login)

router.use(protect)

router.patch("/change-password", changeMyPassword)


module.exports = router;

