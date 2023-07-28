const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const {
    getAll, createDepartment,
    getDepartment, updateDepartment, deleteDepartment
} = require("../controllers/departmentController")

const { addDoctor, getAllDoctors } = require("../controllers/doctorController");
const { uploadUserPhoto, resizeUserPhoto } = require("../controllers/userController");

const router = express.Router()

router.use(protect)

router.get("/:departmentId/doctors", getAllDoctors)
router.get("/", getAll)
router.get("/:id", getDepartment)

router.use(restrictTo("HOSPITAL"))

router.post("/:departmentId/add-doctor", uploadUserPhoto, resizeUserPhoto, addDoctor)
router.route("/").post(createDepartment)
router.route("/:id").patch(updateDepartment).delete(deleteDepartment)



module.exports = router;