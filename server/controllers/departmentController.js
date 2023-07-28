
const { getAllData, deleteDoc, updateDoc, getDoc } = require("./handleController")
const Department = require("../models/department")
const asyncHandler = require("express-async-handler")
const Hospital = require("../models/hospital")

const getAll = getAllData(Department)
const createDepartment = asyncHandler( async (req, res) =>{

    const {
        name, description, phone_number
    } = req.body;

    const oldOne = await Department.findOne({name: name})

    if(oldOne) return res.status(404).json("You already added department with same name!")
    
    const hospital = await Hospital.findOne()

    if(!hospital) return res.status(404).json("There was some error!")

    const department = await Department.create({
        name,
        hospital_id: hospital._id,
        description,
        phone_number
    })

    return res.status(200).json(department)

})

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


