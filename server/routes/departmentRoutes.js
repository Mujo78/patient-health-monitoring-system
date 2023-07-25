const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const {
    getAll, createDepartment,
    getDepartment, updateDepartment, deleteDepartment
} = require("../controllers/departmentController")

const router = express.Router()


router.use(protect, restrictTo("HOSPITAL"))

router.route("/").get(getAll).post(createDepartment)
router.route("/:id").get(getDepartment).patch(updateDepartment).delete(deleteDepartment)



module.exports = router;