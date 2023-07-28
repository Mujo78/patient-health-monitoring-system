const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");
const {
    getPharmacy,
    addPharmacy,
    deletePharmacy,
    updatePharmacy
} = require("../controllers/pharmacyController");
const { uploadUserPhoto, resizeUserPhoto } = require("../controllers/userController");

const router = express.Router()

router.use(protect)

router.get("/", getPharmacy)

router.patch("/:id",restrictTo('PHARMACY'), updatePharmacy)

router.post("/", restrictTo('HOSPITAL'), uploadUserPhoto, resizeUserPhoto,  addPharmacy)
router.delete("/:id",restrictTo('HOSPITAL', 'PHARMACY'),  deletePharmacy)

module.exports = router;

