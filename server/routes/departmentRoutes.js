const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const {
    getAll, createDepartment,
    getDepartment, updateDepartment, deleteDepartment
} = require("../controllers/departmentController")

const doctorRoutes = require("../routes/doctorRoutes");
const { addDoctor, getAllDoctors } = require("../controllers/doctorController");

const router = express.Router()


router.use(protect)

router.use("/:departmentId/doctors", getAllDoctors)

router.use(restrictTo("HOSPITAL"))

router.post("/:departmentId/add-doctor", addDoctor)
router.route("/").get(getAll).post(createDepartment)
router.route("/:id").get(getDepartment).patch(updateDepartment).delete(deleteDepartment)



module.exports = router;