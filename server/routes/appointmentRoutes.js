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
  getPatientsForDoctorBySearch,
  getFinishedAppointmentForPatient,
  getLatestFinishedAppointment,
  numberOfAppointmentsPerMonthForDepartments,
  doctorAppointmentDashboard,
  doctorDasboard,
  getOtherAppointmentsForDay,
} = require("../controllers/appointmentController");

const router = express.Router();

router.use(protect);

router.post("/day", restrictTo("PATIENT", "DOCTOR"), getAppointmentForDay);
router.post("/others-today", restrictTo("PATIENT"), getOtherAppointmentsForDay);
router.post("/", restrictTo("PATIENT"), makeAppointment);
router.patch("/:id", restrictTo("DOCTOR"), makeAppointmentFinished);

router.get("/doctor-patients/:id", restrictTo("DOCTOR"), getPatientsForDoctor);
router.get("/search/:id", restrictTo("DOCTOR"), getPatientsForDoctorBySearch);

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
router.post(
  "/:id/patient-latest-record",
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
  getFinishedAppointmentForPatient
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
