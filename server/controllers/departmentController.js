
const { getAllData, createNewDoc, deleteDoc, updateDoc, getDoc } = require("./handleController")
const Department = require("../models/department")

const getAll = getAllData(Department)
const createDepartment = createNewDoc(Department)
const deleteDepartment = deleteDoc(Department)
const updateDepartment = updateDoc(Department)
const getDepartment = getDoc(Department)

module.exports = {
    getAll,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartment
}


