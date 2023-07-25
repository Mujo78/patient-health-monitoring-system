const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");


const {
    getMedicine, 
    getMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine
} = require("../controllers/medicineController")


const router = express.Router()

router.use(protect)

router.get("/", getMedicines)
router.get("/:id", getMedicine)

router.use(restrictTo("PHARMACY"))
router.post("/", createMedicine)
router.route("/:id").patch(updateMedicine).delete(deleteMedicine)


module.exports = router;