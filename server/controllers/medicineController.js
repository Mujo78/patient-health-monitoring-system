const {
  getAllData,
  getDoc,
  updateDoc,
  deleteDoc,
} = require("./handleController");
const Medicine = require("../models/medicine");
const asyncHandler = require("express-async-handler");
const Pharmacy = require("../models/pharmacy");
const sharp = require("sharp");

const resizeMedicinePhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${req.body.name}-${req.body.strength}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/${req.file.filename}`);

  next();
};

const getMedicines = asyncHandler(async (req, res) => {
  const { searchQuery, category } = req.query;
  const page = parseInt(req.query.page) || 1;

  let responseObj = {};
  let query = Medicine.find();

  const limit = 4;
  const startIndx = (Number(page) - 1) * limit;

  query = query.limit(limit).skip(startIndx);

  if (searchQuery) {
    if (category) {
      query = query.where({
        name: new RegExp(searchQuery, "i"),
        category: category,
      });
    } else {
      query = query.where({ name: new RegExp(searchQuery, "i") });
    }
  }

  const result = await query.exec();
  if (result.length === 0) return res.status(404).json("No data available");

  const total = await Medicine.countDocuments(query.getFilter());
  responseObj.currentPage = Number(page);
  responseObj.numOfPages = Math.ceil(total / limit);
  responseObj.data = result;

  return res.status(200).json(responseObj);
});

const getMedicine = getDoc(Medicine);
const getAllMedicine = asyncHandler(async (req, res) => {
  const data = await Medicine.find().select("_id name strength");

  if (!data) return res.status(404).json("No data available!");

  return res.status(200).json(data);
});

const createMedicine = asyncHandler(async (req, res) => {
  if (req.file) req.body.photo = req.file.filename;

  const {
    name,
    description,
    strength,
    category,
    price,
    photo,
    manufacturer,
    available,
  } = req.body;

  const conditionals = [{ name: name }, { name, strength, category }];

  const oldOne = await Medicine.findOne({
    $and: [{ _id: { $ne: req.params.id } }, { $or: conditionals }],
  });
  if (oldOne) return res.status(400).json("Medicine already in database!");

  const ph = await Pharmacy.findOne();
  if (!ph) return res.status(400).json("There is no pharmacy for medicine!");

  const newMedicine = await Medicine.create({
    name,
    description,
    pharmacy_id: ph._id,
    strength,
    category,
    available,
    photo,
    price,
    manufacturer,
  });

  return res.status(200).json(newMedicine);
});

const updateMedicine = asyncHandler(async (req, res) => {
  if (req.file) req.body.photo = req.file.filename;
  if (req.body.available)
    req.body.available = JSON.parse(req.body.available.toLowerCase());

  const { name, strength, category } = req.body;

  const conditionals = [{ name: name }, { name, strength, category }];

  const oldOne = await Medicine.findOne({
    $and: [{ _id: { $ne: req.params.id } }, { $or: conditionals }],
  });
  if (oldOne) return res.status(400).json("Medicine already in database!");

  const ph = await Pharmacy.findOne();
  if (!ph) return res.status(400).json("There is no pharmacy for medicine!");

  const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated)
    return res.status(404).json("There was an error, please try again later!");

  return res.status(200).json(updated);
});

const deleteMedicine = deleteDoc(Medicine);

module.exports = {
  getMedicines,
  getMedicine,
  getAllMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  resizeMedicinePhoto,
};
