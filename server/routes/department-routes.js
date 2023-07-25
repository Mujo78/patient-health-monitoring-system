const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const {
    getAll, createDepartment,
    getDepartment, updateDepartment, deleteDepartment
} = require("../controllers/departmentController")

const router = express.Router()


router.use(protect, restrictTo("hospital"))

router.route("/department").get(getAll).post(createDepartment)
router.route("/department/:id").get(getDepartment).patch(updateDepartment).delete(deleteDepartment)



module.exports = router;