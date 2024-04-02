const asyncHandler = require("express-async-handler");
const {
  getAllData,
  deleteDoc,
  getAllDocForUser,
} = require("./handleController");
const cron = require("node-cron");
const moment = require("moment-timezone");
const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const User = require("../models/user");
const Email = require("../utils/email");

const makeAppointment = asyncHandler(async (req, res) => {
  const { doctor_id, reason, appointment_date } = req.body;

  const patient = await Patient.findOne({ user_id: req.user._id });
  if (!patient)
    return res.status(404).json("There was an error, please try again later!");

  const appointmentDateWithoutTime =
    moment(appointment_date).tz("Europe/Sarajevo");
  const startOfDay = appointmentDateWithoutTime
    .startOf("day")
    .utc(true)
    .toDate();
  const endOfDay = appointmentDateWithoutTime.endOf("day").utc(true).toDate();

  const existingAppointment = await Appointment.findOne({
    patient_id: { $ne: patient._id },
    doctor_id,
    appointment_date: new Date(appointment_date),
  });

  if (existingAppointment)
    return res
      .status(400)
      .json(
        "It's not possible to make appointment with this doctor at that time."
      );

  const myExistingAppointment = await Appointment.findOne({
    doctor_id,
    patient_id: patient._id,
    appointment_date: { $gte: startOfDay, $lt: endOfDay },
  });

  if (myExistingAppointment)
    return res
      .status(400)
      .json("You already have an appointment with this doctor on this day.");

  const overlappingAppointment = await Appointment.findOne({
    doctor_id: { $ne: doctor_id },
    patient_id: patient._id,
    appointment_date: new Date(appointment_date),
  });

  if (overlappingAppointment)
    return res
      .status(400)
      .json(
        "You already have an appointment with a different doctor at that time."
      );

  const newDate = moment.utc(appointment_date).tz("Europe/Sarajevo");

  const newAppointment = await Appointment.create({
    doctor_id,
    patient_id: patient._id,
    reason,
    appointment_date: newDate.toDate(),
  });

  return res.status(200).json(newAppointment);
});

const makeAppointmentFinished = asyncHandler(async (req, res) => {
  if (
    req.body.doctor_id ||
    req.body.patient_id ||
    req.body.reason ||
    req.body.appointment_date
  ) {
    return res
      .status(404)
      .json("You can't edit fields: reason, date of an appointment!");
  }

  const app = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!app)
    return res.status(404).json("There was an error, please try again later!");

  return res.status(200).json(app);
});

const editAppointmentInfo = asyncHandler(async (req, res) => {
  const appToEdit = await Appointment.findById(req.params.id);
  if (!appToEdit) return res.status(200).json("Appointment not found!");

  const patientEditing = await Patient.findById(appToEdit.patient_id);
  const currentUserPatient = await Patient.findOne({ user_id: req.user._id });
  if (patientEditing._id.toString() !== currentUserPatient._id.toString())
    return res
      .status(400)
      .json("This is not your appointment, you can't edit it!");

  const appDate = new Date(appToEdit.appointment_date);
  if (appDate <= new Date())
    return res.status(400).json("You can't edit past appointments!");

  const timeDifference = appDate - new Date();
  const minutesDifference = timeDifference / (1000 * 60);
  if (minutesDifference < 60)
    return res
      .status(400)
      .json(
        "You can't edit appointments within 1 hour of the appointment time."
      );

  const appointmentDateWithoutTime = moment(req.body.appointment_date)
    .tz("Europe/Sarajevo")
    .format("YYYY-MM-DD");

  const existingAppointment = await Appointment.findOne({
    patient_id: { $ne: patientEditing._id },
    doctor_id: appToEdit.doctor_id,
    appointment_date: new Date(req.body.appointment_date),
  });

  if (existingAppointment)
    return res
      .status(400)
      .json(
        "It's not possible to make appointment with this doctor at that time."
      );

  const myExistingAppointment = await Appointment.findOne({
    _id: { $ne: appToEdit._id },
    doctor_id: appToEdit.doctor_id,
    patient_id: appToEdit.patient_id,
    appointment_date: {
      $gte: new Date(appointmentDateWithoutTime),
      $lt: moment(appointmentDateWithoutTime).add(1, "day"),
    },
  });
  if (myExistingAppointment)
    return res
      .status(400)
      .json("You already have an appointment with this doctor on this day.");

  const overlappingAppointment = await Appointment.findOne({
    doctor_id: { $ne: appToEdit.doctor_id },
    patient_id: appToEdit.patient_id,
    appointment_date: {
      $eq: moment(req.body.appointment_date)
        .tz("Europe/Sarajevo")
        .subtract(2, "hours"),
    },
  });
  if (overlappingAppointment)
    return res
      .status(400)
      .json(
        "You already have an appointment with a different doctor at that time."
      );

  if (req.body.reason) appToEdit.reason = req.body.reason;
  if (req.body.appointment_date)
    appToEdit.appointment_date = req.body.appointment_date;

  await appToEdit.save({ validateBeforeSave: false });
  return res.status(200).json(appToEdit);
});

const getAppointmentForPatient = getAllDocForUser();

const getLatestAppointmentForPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user_id: req.params.patientUserId });
  const app = await Appointment.findOne({
    patient_id: patient._id,
    finished: true,
  }).sort({ appointment_date: -1 });

  return res.status(200).json(app);
});

const getLatestAppointmentForPatientWithDoctor = asyncHandler(
  async (req, res) => {
    const { patient_id, appointment_id } = req.body;

    const doctor = await Doctor.findOne({ user_id: req.params.id });
    if (!doctor) return res.status(404).json("This doctor is not in database!");

    const patient = await Patient.findById(patient_id);
    if (!patient)
      return res.status(404).json("This patient is not in database!");

    const currentAppointment = await Appointment.findById(appointment_id);
    const app = await Appointment.findOne({
      _id: { $ne: appointment_id },
      appointment_date: { $lt: currentAppointment.appointment_date },
      patient_id: patient._id,
      doctor_id: doctor._id,
      finished: true,
    })
      .populate("therapy", "_id name strength")
      .sort({ appointment_date: -1 })
      .limit(1);

    if (!app)
      return res
        .status(404)
        .json("No finished appointment found for this patient!");

    return res.status(200).json(app);
  }
);

cron.schedule("* * * * *", async () => {
  const allApp = await Appointment.find({
    appointment_date: { $gte: new Date() },
  });

  const currentTime = moment().tz("Europe/Sarajevo");
  const oneHourFromNow = currentTime.clone().add(1, "hour");
  const upcomingAppointments = allApp.filter((appointment) => {
    const appT = moment(appointment.appointment_date).tz("Europe/Sarajevo");
    return (
      appT.isBetween(currentTime, oneHourFromNow) && !appointment.notification
    );
  });
  upcomingAppointments.forEach(async (el) => {
    try {
      const patient = await Patient.findById(el.patient_id);

      if (!patient)
        return res
          .status(200)
          .json("There was an error, please try again later!");

      const user = await User.findById(patient.user_id);

      const message = `We would like to remind you, about your appointment with Dr. ${
        el.doctor_id.last_name
      }. \n Your appointment is soon, time: ${moment(el.appointment_date).tz(
        "Europe/Sarajevo"
      )}`;
      const subject = "Appointment reminder!";

      if (user.notification === true) {
        await new Email(user, patient.first_name).send(
          subject,
          "appointment-reminder",
          message
        );

        el.notification = true;
        await el.save();
      }
    } catch (err) {
      throw new Error(err);
    }
  });
});

const getAppointmentForDay = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).json("There was an error, please try again later!");

  let model, mod_id;
  let query = {};

  if (user.role === "PATIENT") {
    model = Patient;
    mod_id = "patient_id";
  } else {
    model = Doctor;
    mod_id = "doctor_id";
  }

  const mod = await model.findOne({ user_id: user._id });
  if (!mod)
    return res.status(404).json("There was an error, please try again later!");

  const userDate = moment.tz(date, "Europe/Sarajevo");

  if (!userDate.isValid()) return res.status(400).json("Invalid date format");

  const startOfDay = userDate.clone().startOf("day").utc(true).toDate();
  const endOfDay = userDate.clone().endOf("day").utc(true).toDate();

  query[mod_id] = mod._id;
  query.appointment_date = {
    $gte: startOfDay,
    $lte: endOfDay,
  };

  const appointmentsDay = await Appointment.find(query);

  if (appointmentsDay) return res.status(200).json(appointmentsDay);

  return res.status(404).json("There was an error, please try again later!");
});

const getOtherAppointmentsForDay = asyncHandler(async (req, res) => {
  const { date, doctor_id } = req.body;
  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).json("There was an error, please try again later!");

  const patient = await Patient.findOne({ user_id: user._id });
  if (!patient)
    return res.status(404).json("There is no patient with such ID!");

  const userDate = moment.tz(date, "Europe/Sarajevo");

  if (!userDate.isValid()) {
    return res.status(400).json("Invalid date format");
  }

  const startOfDay = userDate.clone().startOf("day").utc(true).toDate();
  const endOfDay = userDate.clone().endOf("day").utc(true).toDate();

  const appointmentsDay = await Appointment.find({
    doctor_id: doctor_id,
    patient_id: { $ne: patient._id },
    appointment_date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (appointmentsDay) return res.status(200).json(appointmentsDay);

  return res.status(404).json("There was an error, please try again later!");
});

const getPatientsForDoctor = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const { searchQuery } = req.query;
  const limit = 8;
  const startIndx = (page - 1) * limit;

  const doc = await Doctor.findOne({ user_id: req.user.id });

  if (!doc) return res.status(404).json("That doctor doesn't exists!");

  const app = await Appointment.aggregate([
    { $match: { doctor_id: doc._id } },
    { $group: { _id: "$patient_id" } },
  ]);
  if (!app) return res.status(404).json("There are no patients right now!");

  const patientIds = app.map((item) => item._id);
  let query = Patient.find({ _id: { $in: patientIds } })
    .sort({ _id: -1 })
    .limit(limit)
    .skip(startIndx);

  if (searchQuery) {
    const [first, last] = searchQuery.split(" ");

    const conditionals = {};

    if (first) {
      conditionals.first_name = new RegExp(first, "i");
    }

    if (last) {
      conditionals.last_name = new RegExp(last, "i");
    }

    query = query.where({
      $and: [conditionals],
    });
  }

  const patients = await query.exec();

  if (!patients) return res.status(404).json("There are no data available.");

  const total = await Patient.countDocuments(query.getFilter());

  return res.status(200).json({
    data: patients,
    currentPage: Number(page),
    numOfPages: Math.ceil(total / limit),
  });
});

const getFinishedAppointmentsForPatient = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json("This patient doesn't exists!");

  const doctor = await Doctor.findOne({ user_id: req.user._id });
  if (!doctor) return res.status(404).json("This doctor doesn't exists!");

  const LIMIT = 9;
  const startIndx = (Number(page) - 1) * LIMIT;

  const apps = await Appointment.find({
    patient_id: patient._id,
    doctor_id: doctor._id,
    finished: true,
  })
    .populate("therapy", "_id name strength")
    .select({
      patient_id: 0,
      doctor_id: 0,
      _id: 1,
      diagnose: 1,
      other_medicine: 1,
      reason: 1,
      description: 1,
      appointment_date: 1,
    })
    .sort({ appointment_date: -1 })
    .limit(LIMIT)
    .skip(startIndx)
    .exec();

  const total = await Appointment.countDocuments({
    patient_id: patient._id,
    doctor_id: doctor._id,
    finished: true,
  });
  return res.status(200).json({
    currentPage: Number(page),
    numOfPages: Math.ceil(total / LIMIT),
    data: apps,
  });
});

const getLatestFinishedAppointment = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json("There is no user with such ID!");

  const patient = await Patient.findOne({ user_id: user._id });
  if (!patient)
    return res.status(404).json("There is no patient with such ID!");

  const latestApp = await Appointment.findOne({
    patient_id: patient._id,
    finished: true,
  })
    .sort({ appointment_date: -1 })
    .select("appointment_date doctor_id")
    .exec();

  const latest = {};

  latest.patient = patient;

  if (latestApp) {
    latest.appointment = {
      _id: latestApp._id,
      doctor_id: latestApp.doctor_id,
      appointment_date: latestApp.appointment_date,
    };
  }

  return res.status(200).json(latest);
});

const numberOfAppointmentsPerMonthForDepartments = asyncHandler(
  async (req, res) => {
    const { month } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("There is no user with such ID!");

    const patient = await Patient.findOne({ user_id: user._id });
    if (!patient)
      return res.status(404).json("There is no patient with such ID!");

    let year = new Date().getFullYear();
    let newYearMonth;
    const start = new Date(`${year}/${month}/01 GMT`);
    if (start.getMonth() + 2 === 13) {
      newYearMonth = 1;
      year++;
    } else {
      newYearMonth = start.getMonth() + 2;
    }
    const end = new Date(`${year}/${newYearMonth}/01 GMT`);

    const result = await Appointment.aggregate([
      {
        $match: {
          patient_id: patient._id,
          appointment_date: { $gte: start, $lt: end },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctor_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $group: {
          _id: "$doctor.speciality",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const allSpecialties = await Doctor.distinct("speciality");

    const counts = {};

    allSpecialties.forEach((specialty) => {
      counts[specialty] = 0;
    });

    result.forEach((item) => {
      counts[item.name] = item.count;
    });

    const final = Object.keys(counts)
      .map((name) => ({
        name,
        visited: counts[name],
      }))
      .sort((a, b) => b.visited - a.visited)
      .slice(0, 5);

    return res.status(200).json(final);
  }
);

const doctorAppointmentDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json("There is no user with such ID!");

  const doctor = await Doctor.findOne({ user_id: user._id })
    .select("+department_id")
    .populate("department_id");
  if (!doctor) return res.status(404).json("There is no doctor with such ID!");

  const finishedLatest = await Appointment.findOne({
    doctor_id: doctor._id,
    finished: true,
  })
    .sort({ appointment_date: -1 })
    .select({
      doctor_id: 0,
      patient_id: 1,
      appointment_date: 1,
      _id: 1,
    })
    .lean()
    .exec();

  const startOfYear = new Date(new Date().getFullYear().toString() + "-01-01");

  const app = await Appointment.aggregate([
    {
      $match: {
        doctor_id: doctor._id,
        appointment_date: { $gte: startOfYear, $lte: new Date() },
      },
    },
    { $group: { _id: "$patient_id" } },
  ]);
  if (!app) return res.status(404).json("There are no patients right now!");

  const patientIds = app.map((item) => item._id);
  const patients = await Patient.find({ _id: { $in: patientIds } });

  const { male, female, other } = patients.reduce(
    (result, doc) => {
      if (doc.gender === "Male") {
        result.male += 1;
      } else if (doc.gender === "Female") {
        result.female += 1;
      } else {
        result.other += 1;
      }

      return result;
    },
    { male: 0, female: 0, other: 0 }
  );

  return res.status(200).json({
    latest: finishedLatest,
    department_name: doctor.department_id.name,
    gender: [
      { name: "Male", value: male },
      { name: "Female", value: female },
      { name: "Other", value: other },
    ],
  });
});

const doctorDasboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json("There is no user with such ID!");

  const doctor = await Doctor.findOne({ user_id: user._id })
    .select("+department_id")
    .populate("department_id");
  if (!doctor) return res.status(404).json("There is no doctor with such ID!");

  const startOfYear = new Date(new Date().getFullYear().toString() + "-01-01");

  const patients = await Appointment.aggregate([
    {
      $match: {
        doctor_id: doctor._id,
        appointment_date: { $gte: startOfYear, $lte: new Date() },
      },
    },
    {
      $group: {
        _id: "$patient_id",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        patient_id: 1,
        count: 1,
      },
    },
  ]);

  const userDate = moment.tz(new Date(), "Europe/Sarajevo");

  const startOfDay = moment(userDate).startOf("day");
  const endOfDay = moment(userDate).endOf("day");

  const tomorrow = moment(userDate).add(1, "day");

  const startOfTomorrowDay = moment(tomorrow).startOf("day");
  const endOfTomorrowDay = moment(tomorrow).endOf("day");

  const todays = await Appointment.find({
    doctor_id: doctor._id,
    appointment_date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).countDocuments();

  const tomorrows = await Appointment.find({
    doctor_id: doctor._id,
    appointment_date: {
      $gte: startOfTomorrowDay,
      $lte: endOfTomorrowDay,
    },
  }).countDocuments();

  const startOfMonth = moment(userDate).startOf("month");
  const endOfMonth = moment(userDate).endOf("month");

  const apps = await Appointment.find({
    doctor_id: doctor._id,
    appointment_date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  const totalAge = apps.reduce((acc, app) => {
    const dateOfBirthString = app.patient_id.date_of_birth;
    const age = moment().diff(dateOfBirthString, "years");
    return acc + age;
  }, 0);

  const averageAge = apps.length > 0 ? totalAge / apps.length : 0;

  let newPatients = 0;
  let oldPatients = 0;

  for (const appointment of patients) {
    if (appointment.count === 1) {
      newPatients++;
    } else {
      oldPatients++;
    }
  }

  const totalPatients = newPatients + oldPatients;

  return res.status(200).json({
    patientStatistic: [
      { name: "Total patients", value: totalPatients },
      { name: "Old patients", value: oldPatients },
      { name: "New patients", value: newPatients },
    ],
    averageAge: averageAge.toFixed(2),
    apps: [
      { name: userDate.format("dddd") + " (today)", value: todays },
      { name: tomorrow.format("dddd") + " (tomorrow)", value: tomorrows },
    ],
  });
});

const getOneAppointment = asyncHandler(async (req, res) => {
  const appId = req.params.id;

  const appointment = await Appointment.findById(appId).populate("therapy");

  if (appointment) {
    return res.status(200).json(appointment);
  }

  return res.status(404).json("Appointment doesn't exists.");
});
const getAllAppointments = getAllData(Appointment);
const cancelAppointment = deleteDoc(Appointment);

module.exports = {
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
  getOtherAppointmentsForDay,
};
