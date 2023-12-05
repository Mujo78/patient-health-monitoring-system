const {
  getAllData,
  deleteDoc,
  updateDoc,
  getDoc,
} = require("./handleController");
const Department = require("../models/department");
const asyncHandler = require("express-async-handler");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");
const moment = require("moment-timezone");
const Appointment = require("../models/appointment");

const getAll = getAllData(Department);

const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, phone_number } = req.body;

  const oldOne = await Department.findOne({ name: name });

  if (oldOne)
    return res.status(404).json("You already added department with same name!");

  const hospital = await Hospital.findOne();

  if (!hospital) return res.status(404).json("There was some error!");

  const department = await Department.create({
    name,
    hospital_id: hospital._id,
    description,
    phone_number,
  });

  return res.status(200).json(department);
});

const deleteDepartment = deleteDoc(Department);
const updateDepartment = updateDoc(Department);
const getDepartment = getDoc(Department);

const getMyDepartment = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user_id: req.user._id }).select(
    "+department_id"
  );
  if (!doctor)
    return res.status(400).json("There was an error, please try again later!");

  const department = await Department.findById(doctor.department_id);
  if (!department)
    return res.status(400).json("There was an error, please try again later!");

  const doctorsFromDepartment = await Doctor.find({
    department_id: department._id,
  }).sort({ first_name: 1 });
  if (doctorsFromDepartment.length === 0)
    return res
      .status(400)
      .json("There are no doctors registred in database fror this department!");

  const numberOfDoctors = doctorsFromDepartment.length;

  const todaysDay = moment(new Date()).tz("Europe/Sarajevo").format("dddd");

  const { todayActiveDoctors, otherDoctors } = doctorsFromDepartment.reduce(
    (result, doctor) => {
      if (doctor.available_days.includes(todaysDay)) {
        result.todayActiveDoctors.push(doctor);
      } else {
        result.otherDoctors.push(doctor);
      }
      return result;
    },
    { todayActiveDoctors: [], otherDoctors: [] }
  );

  const { male, female, other } = doctorsFromDepartment.reduce(
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

  const result = {
    department: {
      name: department.name,
      phone_number: department.phone_number,
      description: department.description,
    },
    numberOfDoctors,
    numberOfActiveDoctors: todayActiveDoctors.length,
    todayActiveDoctors,
    otherDoctors,
    gender: [
      { name: "Male", value: male },
      { name: "Female", value: female },
      { name: "Other", value: other },
    ],
  };

  return res.status(200).json(result);
});

const myDepartmentAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user_id: req.user._id }).select(
    "+department_id"
  );
  if (!doctor)
    return res.status(400).json("There was an error, please try again later!");

  const department = await Department.findById(doctor.department_id);
  if (!department)
    return res.status(400).json("There was an error, please try again later!");

  const doctorsFromDepartment = await Doctor.find({
    department_id: department._id,
  }).sort({ first_name: 1 });
  if (doctorsFromDepartment.length === 0)
    return res
      .status(400)
      .json("There are no doctors registred in database fror this department!");

  const ids = doctorsFromDepartment.map((n) => n._id);

  const userDate = moment.tz(new Date(), "Europe/Sarajevo");

  const startOfDay = userDate.clone().startOf("day").utc().toDate();
  const endOfDay = userDate.clone().endOf("day").utc().toDate();

  const startOfWeek = userDate.clone().startOf("week").utc().toDate();
  const endOfWeek = userDate.clone().endOf("week").utc().toDate();

  const appointmentsDay = await Appointment.find({
    doctor_id: { $in: ids },
    appointment_date: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
  });

  const todayAppointments = appointmentsDay.filter(
    (n) => n.appointment_date >= startOfDay && n.appointment_date <= endOfDay
  );

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const total = todayAppointments.length;

  const { finished, pending } = todayAppointments.reduce(
    (result, app) => {
      if (app.finished) {
        result.finished += 1;
      } else {
        result.pending += 1;
      }
      return result;
    },
    { finished: 0, pending: 0 }
  );

  const appointmentsByDay = [
    { name: "Monday", value: 0 },
    { name: "Tuesday", value: 0 },
    { name: "Wednesday", value: 0 },
    { name: "Thursday", value: 0 },
    { name: "Friday", value: 0 },
    { name: "Saturday", value: 0 },
    { name: "Sunday", value: 0 },
  ];

  appointmentsDay.forEach((app) => {
    const appointmentDate = new Date(app.appointment_date);
    const dayOfWeek = daysOfWeek[appointmentDate.getDay()];

    const dayObject = appointmentsByDay.find((day) => day.name === dayOfWeek);
    if (dayObject) {
      dayObject.value++;
    }
  });

  return res.status(200).json({
    todayAppointment: { total, finished, pending },
    appointmentsByDay,
  });
});

const getAllInfoAboutDepartment = asyncHandler(async (req, res) => {
  const { departmentName } = req.params;

  const department = await Department.findOne({ name: departmentName });
  if (!department)
    return res.status(404).json("There is no department with such name!");

  const departmentDoctors = await Doctor.find({
    department_id: department._id,
  }).select("_id user_id first_name last_name speciality qualification");

  const result = {
    department,
    doctors: departmentDoctors
      ? departmentDoctors
      : "There are no doctors for this department!",
  };

  return res.status(200).json(result);
});

module.exports = {
  getAll,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartment,
  getMyDepartment,
  myDepartmentAppointments,
  getAllInfoAboutDepartment,
};
