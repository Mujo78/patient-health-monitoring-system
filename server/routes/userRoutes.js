
const express = require("express");
const { signup, login, changeMyPassword } = require("../controllers/authController");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");
const { uploadUserPhoto, resizeUserPhoto, updateUserProfile, updateMe } = require("../controllers/userController");

const router = express.Router()


router.post("/signup", uploadUserPhoto, resizeUserPhoto, signup)
router.post("/login", login)

router.use(protect)

router.patch("/change-password", changeMyPassword)
router.patch("/update-me", uploadUserPhoto, resizeUserPhoto, updateMe)

router.use(restrictTo('HOSPITAL'))
router.patch("/edit-profile/:id", uploadUserPhoto, resizeUserPhoto, updateUserProfile)

module.exports = router;
