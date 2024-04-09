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
  getLatestAppointmentForPatientWithDoctor,
  getPatientsForDoctor,
  getFinishedAppointmentsForPatient,
  getLatestFinishedAppointment,
  numberOfAppointmentsPerMonthForDepartments,
  doctorAppointmentDashboard,
  doctorDasboard,
  getAvailableTimeForAppointmentsForADay,
} = require("../controllers/appointmentController");

const router = express.Router();

router.use(protect);

router.post("/day", restrictTo("PATIENT", "DOCTOR"), getAppointmentForDay);

router.post(
  "/others-today",
  restrictTo("PATIENT"),
  getAvailableTimeForAppointmentsForADay
);

router.post("/", restrictTo("PATIENT"), makeAppointment);
router.patch("/:id", restrictTo("DOCTOR"), makeAppointmentFinished);

router.get("/doctor-patients", restrictTo("DOCTOR"), getPatientsForDoctor);

router.get(
  "/doctor-dashboard-info",
  restrictTo("DOCTOR"),
  doctorAppointmentDashboard
);
router.get("/doctor-dashboard", restrictTo("DOCTOR"), doctorDasboard);

router.get("/:id", restrictTo("DOCTOR", "PATIENT"), getOneAppointment);
router.get(
  "/:patientUserId",
  restrictTo("DOCTOR", "PATIENT"),
  getLatestAppointmentForPatient
);

router.get(
  "/:appointmentId/patient-latest-record",
  restrictTo("DOCTOR", "PATIENT"),
  getLatestAppointmentForPatientWithDoctor
);

router.get(
  "/person/:id",
  restrictTo("PATIENT", "DOCTOR"),
  getAppointmentForPatient
);
router.get(
  "/patient/:id",
  restrictTo("DOCTOR"),
  getFinishedAppointmentsForPatient
);

router.get(
  "/per-month/:month",
  restrictTo("PATIENT"),
  numberOfAppointmentsPerMonthForDepartments
);

router.get("/", restrictTo("PATIENT"), getLatestFinishedAppointment);

router.patch("/edit-details/:id", restrictTo("PATIENT"), editAppointmentInfo);
router.delete("/:id", restrictTo("DOCTOR", "PATIENT"), cancelAppointment);

module.exports = router;
