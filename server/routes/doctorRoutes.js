const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const {
    getDoctor,
    updateDoctor,
    deleteDoctor,
    getMe
} = require("../controllers/doctorController")

const router = express.Router()

router.use(protect)

router.get("/get-me",restrictTo('DOCTOR'), getMe)
router.get("/:id", getDoctor)

router.use(restrictTo('HOSPITAL', 'DOCTOR'))

router.patch("/:id", updateDoctor)
router.patch("/deactivate/:id", deleteDoctor)

module.exports = router;