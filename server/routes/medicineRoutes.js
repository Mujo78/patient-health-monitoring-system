const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");
const { uploadUserPhoto } = require("../controllers/userController");

const {
  getMedicine,
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  resizeMedicinePhoto,
  getAllMedicine,
} = require("../controllers/medicineController");

const router = express.Router();

router.use(protect);

router.get("/", getMedicines);
router.get("/all", getAllMedicine);
router.get("/:id", getMedicine);

router.use(restrictTo("PHARMACY"));
router.post("/", uploadUserPhoto, resizeMedicinePhoto, createMedicine);
router
  .route("/:id")
  .patch(uploadUserPhoto, resizeMedicinePhoto, updateMedicine)
  .delete(deleteMedicine);

module.exports = router;
