const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const {
    getHospitalInfo,
    updateHospitalInfo
} = require("../controllers/hospitalController")

const router = express.Router()

router.use(protect)

router.get("/", getHospitalInfo)
router.patch("/:id", restrictTo('HOSPITAL'), updateHospitalInfo)


module.exports = router;
