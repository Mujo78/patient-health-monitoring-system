const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddlewares");

const {
    getOneAppointment,
    getAllAppointments,
    getAppointmentForPatient,
    cancelAppointment,
    makeAppointment,
    makeAppointmentFinished,
    getAppointmentForDay,
    editAppointmentInfo,
    getLatestAppointmentForPatient,
    getLatestAppointmentForPatientWithDoctor
} = require("../controllers/appointmentController")

const router = express.Router()

router.use(protect)

router.post("/day", restrictTo('PATIENT'), getAppointmentForDay)
router.post("/", restrictTo('PATIENT'), makeAppointment)
router.patch("/:id", restrictTo('DOCTOR'), makeAppointmentFinished)

router.get("/:id", restrictTo('DOCTOR', 'PATIENT'), getOneAppointment)
router.get("/:patientUserId", restrictTo("DOCTOR", "PATIENT"), getLatestAppointmentForPatient)
router.post("/:id/patient-latest-record", restrictTo("DOCTOR", "PATIENT"), getLatestAppointmentForPatientWithDoctor)

router.get("/person/:id", restrictTo('PATIENT', 'DOCTOR'), getAppointmentForPatient)

router.patch("/edit-details/:id", restrictTo('PATIENT'), editAppointmentInfo)
router.delete('/:id', restrictTo('DOCTOR', 'PATIENT'), cancelAppointment)

router.get("/", getAllAppointments)

module.exports = router;