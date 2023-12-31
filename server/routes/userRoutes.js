const express = require("express");
const {
  signup,
  login,
  changeMyPassword,
  resetPassword,
  forgotPassword,
  verifyEmail,
  firstTimeUsing,
} = require("../controllers/authController");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");
const {
  uploadUserPhoto,
  resizeUserPhoto,
  updateUserProfile,
  deactivateMyAccount,
  updateMe,
  updatePhoto,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", uploadUserPhoto, resizeUserPhoto, signup);
router.post("/login", login);

router.patch("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.get("/verify/:verificationToken", verifyEmail);

router.patch("/", protect, firstTimeUsing);

router.patch("/change-password", protect, changeMyPassword);
router.patch("/update-me", protect, updateMe);
router.patch(
  "/update-photo",
  protect,
  uploadUserPhoto,
  resizeUserPhoto,
  updatePhoto
);
router.patch("/deactivate", protect, deactivateMyAccount);

router.use(restrictTo("HOSPITAL"));
router.patch(
  "/edit-profile/:id",
  uploadUserPhoto,
  resizeUserPhoto,
  updateUserProfile
);

module.exports = router;
