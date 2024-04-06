const { Model } = require("mongoose");
const asyncHandler = require("express-async-handler");

const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const User = require("../models/user");

const getAllData = (Model) =>
  asyncHandler(async (req, res) => {
    const data = await Model.find();
    if (data) return res.status(200).json(data);
    return res.status(404).json("No data available.");
  });

const createNewDoc = (Model) =>
  asyncHandler(async (req, res) => {
    const newOne = await Model.create(req.body);

    return res.status(200).json(newOne);
  });

const deleteDoc = (Model) =>
  asyncHandler(async (req, res) => {
    const deleted = await Model.findByIdAndDelete(req.params.id, { new: true });

    if (!deleted)
      return res
        .status(404)
        .json(`${Model.modelName} not found! Something went wrong!`);

    return res.status(200).json(deleted);
  });

const updateDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc)
      return res
        .status(404)
        .json(`${Model.modelName} not found! Something went wrong!`);

    return res.status(200).json(updatedDoc);
  });

const getDoc = (Model) =>
  asyncHandler(async (req, res) => {
    const data = await Model.findById(req.params.id);

    if (data) return res.status(200).json(data);
    return res
      .status(404)
      .json(`${Model.modelName} not found! Something went wrong!`);
  });

const getMyInfo = (Model) =>
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json("There is no user with such ID!");

    const model = await Model.findOne({ user_id: user._id });
    if (!model)
      return res
        .status(404)
        .json(`${Model.modelName} not found! Something went wrong!`);

    return res.status(200).json(model);
  });

const getAllDocForUser = () =>
  asyncHandler(async (req, res) => {
    let mod, mod_id;
    if (req.user.role === "PATIENT") {
      mod = Patient;
      mod_id = "patient_id";
    }
    if (req.user.role === "DOCTOR") {
      mod = Doctor;
      mod_id = "doctor_id";
    }

    const query = {};

    const model = await mod.findOne({ user_id: req.params.id });

    if (!model)
      return res.status(404).json("User not found! Something went wrong!");
    query[mod_id] = model._id;
    const allApp = await Appointment.find(query);

    if (allApp) return res.status(200).json(allApp);
  });

const updateMyInfo = (Model) =>
  asyncHandler(async (req, res) => {
    const info = await Model.findOneAndUpdate(
      { user_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!info)
      return res.status(404).json("User not found! Something went wrong!");

    return res.status(200).json(info);
  });

module.exports = {
  getAllData,
  createNewDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  getAllDocForUser,
  getMyInfo,
  updateMyInfo,
};
