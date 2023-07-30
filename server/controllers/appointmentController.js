const asyncHandler = require("express-async-handler")
const { getAllData, deleteDoc, updateDoc, getDoc } = require("./handleController")

const Appointment = require("../models/appointment")
const Patient = require("../models/patient")
const Doctor = require("../models/doctor")


const makeAppointment = asyncHandler( async (req, res) =>{

    const {
        doctor_id, reason, appointment_date, appointment_time
    } = req.body;

    const patient = await Patient.findOne({user_id: req.user._id})

    if(!patient) return res.status(404).json("There was an error, please try again later!")

    const newAppointment = await Appointment.create({
        doctor_id,
        patient_id: patient._id,
        reason,
        appointment_date,
        appointment_time
    })

    return res.status(200).json(newAppointment)
})

const makeAppointmentFinished = asyncHandler( async (req, res) => {

    if(req.body.doctor_id || req.body.reason || req.body.appointment_date || req.body.appointment_time){
        return res.status(404).json("You can't edit fields: reason, date or time of appointment!")
    }

    const app = await Appointment.findByIdAndUpdate(req.params._id, req.body, {new: true, runValidators: true})

    if(!app) return res.status(404).json("There was an error, please try again later!")

    return res.status(200).json(app)
})

/*
const getAppointmentForPatient = asyncHandler ( async (req, res) => {
    console.log(req.user)
    const patient = await Patient.findOne({user_id: req.user._id})
    const allApp = await Appointment.findOne({patient_id : patient._id})
    
    if(!allApp) return res.status(404).json("There was an error, please try again later!")
    
    return res.status(200).json(allApp)
    
})

const getAppointmentForDoctor = asyncHandler ( async (req, res) => {
    
    console.log("")
    console.log(req.user._id)

    const doc = await Doctor.findOne({user_id: req.user._id})
    const allApp = await Appointment.find({doctor_id : doc._id})
    
    if(!allApp) return res.status(404).json("There was an error, please try again later!")
    
    return res.status(200).json(allApp)
})
*/

const getOneAppointment = getDoc(Appointment)
const getAllAppointments = getAllData(Appointment)
const cancelAppointment = deleteDoc(Appointment)

module.exports = {
    getOneAppointment,
    getAllAppointments,
   // getAppointmentForPatient,
    //getAppointmentForDoctor,
    cancelAppointment,
    makeAppointment,
    makeAppointmentFinished
}