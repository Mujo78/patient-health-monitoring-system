const { deleteDoc, getMyInfo, updateMyInfo } = require("./handleController");
const Pharmacy = require("../models/pharmacy");
const Medicine = require("../models/medicine");
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const moment = require("moment-timezone");

const getPharmacy = asyncHandler(async (req, res) => {
  const pharmacy = await Pharmacy.findOne().populate("user_id");
  if (!pharmacy)
    return res.status(404).json("There was an error, please try again later!");
  return res.status(200).json(pharmacy);
});

const addPharmacy = asyncHandler(async (req, res) => {
  if (req.file) req.body.photo = req.file.filename;

  const {
    name,
    email,
    photo,
    password,
    passwordConfirm,
    passwordChangedAt,
    address,
    description,
    phone_number,
    working_hours,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.create({
      email,
      photo: photo ? photo : "default.jpg",
      role: "PHARMACY",
      password,
      passwordConfirm,
      passwordChangedAt,
    });

    const newPharmacyData = await Pharmacy.create({
      name,
      address,
      user_id: user._id,
      description,
      phone_number,
      working_hours,
    });

    if (newPharmacyData) return res.status(200).json(newPharmacyData);

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json(err.message);
  }
});

const deletePharmacy = deleteDoc(Pharmacy);
const updatePharmacy = updateMyInfo(Pharmacy);

const getMe = getMyInfo(Pharmacy);

const pharmacyDashboard = asyncHandler(async (req, res) => {
  const pharmacy = await Pharmacy.findOne().select(
    "_id name address phone_number working_hours"
  );
  if (!pharmacy)
    return res.status(404).json("There is no pharmacy in our system.");

  const total = await Medicine.aggregate([
    {
      $group: {
        _id: null,
        total_price: {
          $sum: { $toDouble: "$price" },
        },
        total_number: {
          $sum: 1,
        },
        total_available: {
          $sum: {
            $cond: [{ $eq: ["$available", true] }, 1, 0],
          },
        },
        total_not_available: {
          $sum: {
            $cond: [{ $eq: ["$available", false] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const recentMedicine = await Medicine.find()
    .select("name _id strength createdAt photo")
    .sort({ createdAt: -1 })
    .limit(3);

  const result = {
    pharmacy,
    total: total[0],
    recentMedicine,
  };

  return res.status(200).json(result);
});

const pharmacyDashboardInfo = asyncHandler(async (req, res) => {
  const medicine = await Medicine.aggregate([
    {
      $group: {
        _id: "$category",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { totalPrice: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        value: "$total",
      },
    },
  ]);

  const topExpensive = await Medicine.aggregate([
    {
      $addFields: {
        priceNumeric: { $toDouble: "$price" },
      },
    },
    {
      $sort: { priceNumeric: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        name: 1,
        value: "$priceNumeric",
      },
    },
  ]);

  const threeDaysAgo = moment().subtract(3, "days").toDate();

  const topUsedMedicines = await Appointment.aggregate([
    {
      $match: {
        appointment_date: { $gte: threeDaysAgo, $lte: new Date() },
      },
    },
    {
      $unwind: "$therapy",
    },
    {
      $group: {
        _id: "$therapy",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  const medicineIds = topUsedMedicines.map((item) => item._id);
  const medicineNames = await Medicine.find(
    { _id: { $in: medicineIds } },
    "name"
  );
  const usedMedicine = topUsedMedicines
    .map((item) => ({
      _id: item._id,
      name:
        medicineNames.find((medicine) => medicine._id.equals(item._id))?.name ??
        "",
      value: item.count,
    }))
    .filter((item) => item.name !== "");

  const result = {
    data: medicine,
    topExpensive,
    usedMedicine,
  };

  return res.status(200).json(result);
});

module.exports = {
  getPharmacy,
  pharmacyDashboardInfo,
  addPharmacy,
  pharmacyDashboard,
  deletePharmacy,
  updatePharmacy,
  getMe,
};
