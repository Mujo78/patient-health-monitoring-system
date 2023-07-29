const asyncHandler = require("express-async-handler")
const mongoose = require("mongoose")
const Patient = require("../models/patient")
const { deleteDoc, getAllData, getDoc, updateDoc } = require("./handleController")
const User = require("../models/user")


const updateMyInfo = asyncHandler( async (req, res) => {
    
    const patientInfo = await Patient.findOneAndUpdate({user_id: req.user._id}, req.body, {new: true, runValidators: true})

    if(!patientInfo) return res.status(404).json("There is no patient with that ID!")

    return res.status(200).json(patientInfo)

})

const deleteMyAccount = deleteDoc(Patient)
const getAllPatients = getAllData(Patient)
const getPatient = getDoc(Patient)
const editPatientData = updateDoc(Patient)

const getMe = asyncHandler( async (req, res) => {

    console.log("object")
    console.log(req.user._id)
    const patient = await Patient.findOne({user_id: req.user._id})

    if(!patient) return res.status(404).json("There was an error, please try again later!")

    return res.status(200).json(patient)
})

const banUserProfile = asyncHandler( async (req, res) =>{

    const userToBan = await User.findByIdAndUpdate(req.params.id, {active: false}, {runValidators: false, new: true})
    if(!userToBan) return res.status(404).json("There was an error, please try again latter!")

    return res.status(200).json(userToBan)
})

module.exports = {
    updateMyInfo,
    deleteMyAccount,
    getMe,
    getAllPatients,
    getPatient,
    editPatientData,
    banUserProfile
}