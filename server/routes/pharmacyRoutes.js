const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");
const {
    getPharmacy,
    addPharmacy,
    deletePharmacy,
    updatePharmacy
} = require("../controllers/pharmacyController")

const router = express.Router()

router.use(protect)

router.patch("/:id", restrictTo('PHARMACY'), updatePharmacy)
router.route("/").post(restrictTo('HOSPITAL'), addPharmacy).get(getPharmacy)
router.route("/:id").delete(restrictTo('HOSPITAL'), deletePharmacy)

module.exports = router;

