const Hospital = require("../models/hospital");
const { getAllData, updateDoc } = require("./handleController");

const getHospitalInfo = getAllData(Hospital);
const updateHospitalInfo = updateDoc(Hospital);

module.exports = {
  getHospitalInfo,
  updateHospitalInfo,
};
