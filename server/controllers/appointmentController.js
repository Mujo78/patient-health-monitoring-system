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

const getStartEndOfDay = (customDate) => {
  let date;

  if (customDate) {
    date = moment(customDate).tz("Europe/Sarajevo");
  } else {
    date = moment().tz("Europe/Sarajevo");
  }

  const startOfDay = date.startOf("day").utc(true).toDate();
  const endOfDay = date.endOf("day").utc(true).toDate();

  return { startOfDay, endOfDay, date };
};

const appointmentCheck = async (
  res,
  appointmentDate,
  patientId,
  doctorId,
  appointmentId
) => {
  const { startOfDay, endOfDay } = getStartEndOfDay(appointmentDate);

  const existingAppointment = await Appointment.findOne({
    patient_id: { $ne: patientId },
    doctor_id: doctorId,
    appointment_date: new Date(appointmentDate),
  });

  if (existingAppointment) {
    return res
      .status(400)
      .json(
        "It's not possible to make appointment with this doctor at that time."
      );
  }

  let options = {
    doctor_id: doctorId,
    patient_id: patientId,
    appointment_date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  };

  if (appointmentId) {
    options._id = { $ne: appointmentId };
  }

  const myExistingAppointment = await Appointment.findOne(options);

  if (myExistingAppointment) {
    return res
      .status(400)
      .json("You already have an appointment with this doctor on this day.");
  }

  const overlappingAppointment = await Appointment.findOne({
    doctor_id: { $ne: doctorId },
    patient_id: patientId,
    appointment_date: {
      $eq: moment(appointmentDate).tz("Europe/Sarajevo").utc(false),
    },
  });

  if (overlappingAppointment) {
    return res
      .status(400)
      .json(
        "You already have an appointment with a different doctor at that time."
      );
  }

  return null;
};

const makeAppointment = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { doctor_id, reason, appointment_date } = req.body;

  const patient = await Patient.findOne({ user_id: userId });

  if (!patient) {
    return res.status(404).json("Patient not found! Something went wrong!");
  }

  if (
    !(await appointmentCheck(res, appointment_date, patient._id, doctor_id))
  ) {
    const newDate = moment.utc(appointment_date).tz("Europe/Sarajevo");
    const newAppointment = await Appointment.create({
      doctor_id,
      patient_id: patient._id,
      reason,
      appointment_date: newDate.toDate(),
    });

    if (!newAppointment)
      return res
        .status(400)
        .json("Not possible to make appointment! There was an error!");

    return res.status(200).json(newAppointment);
  }
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
    return res.status(404).json("Appointment not found! Something went wrong!");

  return res.status(200).json(app);
});

const editAppointmentInfo = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const appToEdit = await Appointment.findById(appointmentId);
  if (!appToEdit)
    return res.status(404).json("Appointment not found! Something went wrong!");

  const patientEditing = await Patient.findById(appToEdit.patient_id);

  if (!patientEditing) {
    return res.status(404).json("Patient not found! Something went wrong!");
  }

  const currentUserPatient = await Patient.findOne({ user_id: req.user._id });

  if (!currentUserPatient) {
    return res.status(404).json("Patient not found! Something went wrong!");
  }

  if (patientEditing._id.toString() !== currentUserPatient._id.toString())
    return res
      .status(400)
      .json("This is not your appointment, you can't edit it!");

  const appDate = moment(appToEdit.appointment_date).tz("Europe/Sarajevo");
  const currentDateTime = moment().tz("Europe/Sarajevo");
  if (appDate.isBefore(currentDateTime)) {
    return res.status(400).json("You can't edit past appointments!");
  }

  const timeDifference = appDate.diff(currentDateTime, "minutes");
  if (timeDifference <= 60) {
    return res
      .status(400)
      .json(
        "You can't edit appointments within 1 hour of the appointment time."
      );
  }

  if (
    !(await appointmentCheck(
      res,
      req.body.appointment_date,
      appToEdit.patient_id._id,
      appToEdit.doctor_id._id,
      appToEdit._id
    ))
  ) {
    if (req.body.reason) appToEdit.reason = req.body.reason;
    if (req.body.appointment_date)
      appToEdit.appointment_date = req.body.appointment_date;

    await appToEdit.save({ validateBeforeSave: false });
    return res.status(200).json(appToEdit);
  }
});

const getAppointmentForPatient = getAllDocForUser();

const getLatestAppointmentForPatientWithDoctor = asyncHandler(
  async (req, res) => {
    const userId = req.user._id;
    const appointmentId = req.params.appointmentId;

    const doctor = await Doctor.findOne({ user_id: userId });
    if (!doctor)
      return res.status(404).json("Doctor not found! Something went wrong!");

    const currentAppointment = await Appointment.findById(appointmentId);
    if (!currentAppointment)
      return res
        .status(404)
        .json("Appointment not found! Something went wrong!");

    const app = await Appointment.findOne({
      _id: { $ne: appointmentId },
      appointment_date: { $lt: currentAppointment.appointment_date },
      patient_id: currentAppointment.patient_id,
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
  const { startOfDay, endOfDay } = getStartEndOfDay();

  const allApp = await Appointment.find({
    appointment_date: { $gte: startOfDay, $lte: endOfDay },
    finished: false,
    notification: false,
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
      const patient = await Patient.findById(el.patient_id._id);

      if (!patient)
        return res.status(200).json("Patient not found! Something went wrong!");

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
  const userId = req.user._id;

  const { startOfDay, endOfDay, date: userDate } = getStartEndOfDay(date);

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json("User not found! Something went wrong!");

  let model, mod_id;
  let query = {};

  if (user.role === "PATIENT") {
    model = Patient;
    mod_id = "patient_id";
  } else {
    model = Doctor;
    mod_id = "doctor_id";
  }

  const modelToFind = await model.findOne({ user_id: user._id });
  if (!modelToFind)
    return res
      .status(404)
      .json(`${model.modelName} not found! Something went wrong!`);

  if (!userDate.isValid()) return res.status(400).json("Invalid date format");

  query[mod_id] = modelToFind._id;
  query.appointment_date = {
    $gte: startOfDay,
    $lte: endOfDay,
  };

  const appointmentsDay = await Appointment.find(query);

  if (appointmentsDay) return res.status(200).json(appointmentsDay);

  return res.status(404).json("No data available.");
});

const formatTime = (time) => {
  return moment(time).tz("Europe/Sarajevo").utc(true).format("h:mm");
};

const workTime = [
  "9:00",
  "9:20",
  "9:40",
  "10:00",
  "10:20",
  "10:40",
  "11:00",
  "11:20",
  "11:40",
  "12:00",
  "1:00",
  "1:20",
  "1:40",
  "2:00",
  "2:20",
  "2:40",
  "3:00",
  "3:20",
  "3:40",
  "4:00",
];

const getAvailableTimeForAppointmentsForADay = asyncHandler(
  async (req, res) => {
    const { date, doctor_id } = req.body;
    const user = await User.findById(req.user._id);

    const { startOfDay, endOfDay, date: userDate } = getStartEndOfDay(date);

    if (!user)
      return res.status(404).json("User not found! Something went wrong!");

    const patient = await Patient.findOne({ user_id: user._id }).select({
      _id: 1,
      user_id: 0,
    });
    if (!patient)
      return res.status(404).json("Patient not found! Something went wrong!");

    if (!userDate.isValid()) {
      return res.status(400).json("Invalid date format!");
    }

    const appointmentsDay = await Appointment.find({
      doctor_id: doctor_id,
      appointment_date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .select({ _id: 0, appointment_date: 1, patient_id: 0, doctor_id: 0 })
      .lean();

    const formattedOtherAppointments = appointmentsDay.map((appointment) =>
      formatTime(appointment.appointment_date)
    );

    const myAppointmentsForThisDay = await Appointment.find({
      patient_id: patient._id,
      doctor_id: { $ne: doctor_id },
      appointment_date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .select({ _id: 0, appointment_date: 1, patient_id: 0, doctor_id: 0 })
      .lean();

    const formattedMyAppointments = myAppointmentsForThisDay.map(
      (appointment) => formatTime(appointment.appointment_date)
    );

    const takenAppointmentsTimes = [
      ...formattedMyAppointments,
      ...formattedOtherAppointments,
    ];

    const availableTimes = workTime.filter(
      (time) => !takenAppointmentsTimes.includes(time)
    );

    if (availableTimes) return res.status(200).json(availableTimes);

    return res.status(404).json("There are no available appointments today!");
  }
);

const getPatientsForDoctor = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const { searchQuery } = req.query;
  const limit = 8;
  const startIndx = (page - 1) * limit;

  const doctor = await Doctor.findOne({ user_id: userId });

  if (!doctor)
    return res.status(404).json("Doctor not found! Something went wrong!");

  const app = await Appointment.aggregate([
    { $match: { doctor_id: doctor._id } },
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

    if (first) conditionals.first_name = new RegExp(first, "i");

    if (last) conditionals.last_name = new RegExp(last, "i");

    query = query.where({
      $and: [conditionals],
    });
  }

  let patients = await query.exec();
  if (patients.length === 0) return res.status(404).json("No data available.");

  const total = await Patient.countDocuments(query.getFilter());

  return res.status(200).json({
    data: patients,
    currentPage: Number(page),
    numOfPages: Math.ceil(total / limit),
  });
});

const getFinishedAppointmentsForPatient = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const patientId = req.params.id;
  const page = parseInt(req.query.page) || 1;

  const patient = await Patient.findById(patientId);
  if (!patient)
    return res.status(404).json("Patient not found! Something went wrong!");

  const doctor = await Doctor.findOne({ user_id: userId });
  if (!doctor)
    return res.status(404).json("Doctor not found! Something went wrong!");

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
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json("User not found! Something went wrong!");

  const patient = await Patient.findOne({ user_id: user._id });
  if (!patient)
    return res.status(404).json("Patient not found! Something went wrong!");

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
    if (!user)
      return res.status(404).json("User not found! Something went wrong!");

    const patient = await Patient.findOne({ user_id: user._id });
    if (!patient)
      return res.status(404).json("Patient not found! Something went wrong!");

    const monthDate = moment(month, "MMMM").utc(true);
    const start = monthDate.startOf("month").toDate();
    const end = monthDate.endOf("month").toDate();

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

    result.forEach(({ name, count }) => {
      counts[name] = count;
    });

    const final = allSpecialties
      .map((specialty) => ({
        name: specialty,
        visited: counts[specialty] || 0,
      }))
      .sort((a, b) => b.visited - a.visited)
      .slice(0, 5);

    return res.status(200).json(final);
  }
);

const doctorAppointmentDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json("User not found! Something went wrong!");

  const doctor = await Doctor.findOne({ user_id: user._id })
    .select("+department_id")
    .populate("department_id");
  if (!doctor)
    return res.status(404).json("Doctor not found! Something went wrong!");

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

  const startOfYear = moment()
    .year(new Date().getFullYear())
    .startOf("year")
    .toDate();

  const app = await Appointment.aggregate([
    {
      $match: {
        doctor_id: doctor._id,
        appointment_date: { $gte: startOfYear, $lte: new Date() },
      },
    },
    { $group: { _id: "$patient_id" } },
  ]);

  const patientIds = app.map((item) => item._id);
  const patients = await Patient.find({ _id: { $in: patientIds } });

  const { male, female, other } = patients.reduce(
    (result, doc) => {
      if (doc.gender === "Male") result.male += 1;
      else if (doc.gender === "Female") result.female += 1;
      else result.other += 1;

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

const doctorDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { startOfDay, endOfDay, date: userDate } = getStartEndOfDay();

  const tomorrow = moment().add(1, "day").tz("Europe/Sarajevo");
  const { startOfDay: startOfTomorrowDay, endOfDay: endOfTomorrowDay } =
    getStartEndOfDay(tomorrow);

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json("User not found! Something went wrong!");

  const doctor = await Doctor.findOne({ user_id: user._id })
    .select("+department_id")
    .populate("department_id");
  if (!doctor)
    return res.status(404).json("Doctor not found! Something went wrong!");

  const startOfYear = moment()
    .year(new Date().getFullYear())
    .startOf("year")
    .toDate();

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

  const startOfMonth = userDate.clone().startOf("month").utc(true).toDate();
  const endOfMonth = userDate.clone().endOf("month").utc(true).toDate();

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
    if (appointment.count === 1) newPatients++;
    else oldPatients++;
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
  const user = req.user;
  const appointment = await Appointment.findById(appId).populate("therapy");

  if (!appointment) {
    return res.status(404).json("Appointment not found! Something went wrong!");
  }

  if (user.role === "PATIENT") {
    const patient = await Patient.findOne({ user_id: user._id });

    if (!patient)
      return res.status(404).json("Patient not found! Something went wrong!");

    if (appointment.patient_id._id.toString() !== patient._id.toString()) {
      return res
        .status(400)
        .json("You are not authorized to access this appointment!");
    }
  }
  return res.status(200).json(appointment);
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
  getLatestAppointmentForPatientWithDoctor,
  getPatientsForDoctor,
  getFinishedAppointmentsForPatient,
  getLatestFinishedAppointment,
  numberOfAppointmentsPerMonthForDepartments,
  doctorAppointmentDashboard,
  doctorDashboard,
  getAvailableTimeForAppointmentsForADay,
};
