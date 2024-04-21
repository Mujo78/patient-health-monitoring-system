const asyncHandler = require("express-async-handler");
const Patient = require("../models/patient");
const {
  deleteDoc,
  getAllData,
  getDoc,
  updateDoc,
  getMyInfo,
  updateMyInfo,
} = require("./handleController");
const User = require("../models/user");

const updateInfo = updateMyInfo(Patient);

const deleteMyAccount = deleteDoc(Patient);
const getAllPatients = getAllData(Patient);
const getPatient = getDoc(Patient);
const editPatientData = updateDoc(Patient);

const getMe = getMyInfo(Patient);

const banUserProfile = asyncHandler(async (req, res) => {
  const userToBan = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { runValidators: false, new: true }
  );
  if (!userToBan)
    return res.status(404).json("User not found! Something went wrong!");

  return res.status(200).json(userToBan);
});

module.exports = {
  updateInfo,
  deleteMyAccount,
  getMe,
  getAllPatients,
  getPatient,
  editPatientData,
  banUserProfile,
};
