const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const {
    getOneAppointment,
    getAllAppointments,
   // getAppointmentForPatient,
    //getAppointmentForDoctor,
    cancelAppointment,
    makeAppointment,
    makeAppointmentFinished
} = require("../controllers/appointmentController")

const router = express.Router()

router.use(protect)

router.post("/", restrictTo('PATIENT'), makeAppointment)
router.patch("/:id", restrictTo('DOCTOR'), makeAppointmentFinished)

router.get("/:id", restrictTo('DOCTOR', 'PATIENT'), getOneAppointment)

//router.get("/patient", restrictTo('PATIENT'), getAppointmentForPatient)
//router.get("/doctor", restrictTo('DOCTOR'), getAppointmentForDoctor)

//router.patch("/edit-appointment-info", restrictTo('PATIENT'), editAppointmentInfo)
router.delete('/:id', restrictTo('DOCTOR', 'PATIENT'), cancelAppointment)

router.get("/", getAllAppointments)

module.exports = router;