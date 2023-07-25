const { getAllData, getDoc, createNewDoc, updateDoc, deleteDoc } = require("./handleController")
const Medicine = require("../models/medicine")

const getMedicines = getAllData(Medicine)
const getMedicine = getDoc(Medicine)
const createMedicine = createNewDoc(Medicine)
const updateMedicine = updateDoc(Medicine)
const deleteMedicine = deleteDoc(Medicine)

module.exports = {
    getMedicines,
    getMedicine,
    createMedicine,
    updateMedicine,
    deleteMedicine
}