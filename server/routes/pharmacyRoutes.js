const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");
const {
  getPharmacy,
  addPharmacy,
  deletePharmacy,
  updatePharmacy,
  getMe,
  pharmacyDashboardInfo,
  pharmacyDashboard,
} = require("../controllers/pharmacyController");
const {
  uploadUserPhoto,
  resizeUserPhoto,
} = require("../controllers/userController");

const router = express.Router();

router.use(protect);

router.get("/get-me", getMe);
router.get("/", getPharmacy);

router.get("/dashboard", pharmacyDashboard);
router.get("/dashboard-info", pharmacyDashboardInfo);

router.patch("/", restrictTo("PHARMACY"), updatePharmacy);

router.post(
  "/",
  restrictTo("HOSPITAL"),
  uploadUserPhoto,
  resizeUserPhoto,
  addPharmacy
);
router.delete("/:id", restrictTo("HOSPITAL", "PHARMACY"), deletePharmacy);

module.exports = router;
