const asyncHandler = require("express-async-handler")
const { getAllData, deleteDoc, getDoc } = require("./handleController")
const cron = require("node-cron")
const moment = require('moment-timezone');
const Appointment = require("../models/appointment")
const Patient = require("../models/patient")
const Doctor = require("../models/doctor")
const User = require("../models/user")
const Email = require("../utils/email")


const makeAppointment = asyncHandler( async (req, res) =>{

    const {
        doctor_id, reason, appointment_date
    } = req.body;

    const patient = await Patient.findOne({user_id: req.user._id})
    if(!patient) return res.status(404).json("There was an error, please try again later!")

    const appointmentDateWithoutTime = moment(appointment_date).tz("Europe/Sarajevo").format("YYYY-MM-DD");

    const existingAppointment = await Appointment.findOne({
        doctor_id,
        patient_id: patient._id,
        appointment_date: { $gte: new Date(appointmentDateWithoutTime), $lt: new Date(moment(appointmentDateWithoutTime).add(1, 'day')) }
    });

    if (existingAppointment) return res.status(400).json("You already have an appointment with this doctor on this day.");
    
    const newDate = moment.utc(appointment_date).tz("Europe/Sarajevo")

    const newAppointment = await Appointment.create({
        doctor_id,
        patient_id: patient._id,
        reason,
        appointment_date: newDate.toDate()
    })

    patient.health_card.push(newAppointment._id)
    patient.save()

    return res.status(200).json(newAppointment)
})

const makeAppointmentFinished = asyncHandler( async (req, res) => {

    if(req.body.doctor_id || req.body.patient_id || req.body.reason || req.body.appointment_date || req.body.appointment_time){
        return res.status(404).json("You can't edit fields: reason, date or time of appointment!")
    }

    const app = await Appointment.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    if(!app) return res.status(404).json("There was an error, please try again later!")
    
    return res.status(200).json(app)
})

/*
const editAppointmentInfo = asyncHandler ( async (req, res) => {

    if(req.body.doctor_id || req.body.diagnose || req.body.therapy || req.bodydescription || req.body.finished){
        return res.status(404).json("You can't edit fields: diagnose, therapy, description!")
    }

    const appToEdit = await Appointment.findById(req.params.id)

    const date = new Date()
    const d = date.toISOString().toString().slice(0, 10)
    const time = date.toLocaleTimeString().toString()
    console.log("object")
})
*/


const getAppointmentForPatient = asyncHandler ( async (req, res) => {

    const patient = await Patient.findOne({user_id: req.params.id })
    const allApp = await Appointment.find({patient_id: patient._id})

    if(!allApp) return res.status(404).json("There was an error, please try again later!")
    return res.status(200).json(allApp)
})

cron.schedule('* * * * *', async () => {
    const allApp = await Appointment.find()

    //console.log(new Date())
    const currentTime = new Date().getTime()
    const twentyMinutesFromNow = currentTime + 20 * 60 * 1000;

    const upcomingAppointments = allApp.filter((appointment) => {
        const appT = new Date(appointment.appointment_date).getTime()
        return appT >= currentTime && appT <= twentyMinutesFromNow && !appointment.notification;
    });

    upcomingAppointments.forEach(async (el) => {
        try{

            const patient = await Patient.findById(el.patient_id)

            if(!patient) return res.status(200).json("There was an error, please try again later!")

            const user = await User.findById(patient.user_id)

            const message = `Dear ${patient.first_name}, \n We would like to remind you, about your appointment. Your appointment is in: ${el.appointment_date}`;
            const subject = "Appointment reminder!"

            await new Email(user).send(subject, message)

            el.notification = true
            await el.save()

        }catch(err) {
            console.log(err.message)
        }
    })
})


const getAppointmentForDoctor = asyncHandler ( async (req, res) => {
    
    const doc = await Doctor.findOne({user_id: req.params.id})
    const allApp = await Appointment.find({doctor_id : doc._id})
    
    if(!allApp) return res.status(404).json("There was an error, please try again later!")
    
    return res.status(200).json(allApp)
})

const getAppointmentForDay = asyncHandler( async (req, res) => {

    const { date } = req.body;

    const userDate = moment.tz(date, "Europe/Sarajevo");

    if (!userDate.isValid()) {
        return res.status(400).json("Invalid date format");
    }

    const startOfDay = userDate.clone().startOf('day').utc().toDate();
    const endOfDay = userDate.clone().endOf('day').utc().toDate();

    const appointmentsDay = await Appointment.find({
        appointment_date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    if (appointmentsDay) return res.status(200).json(appointmentsDay);

})

const getOneAppointment = getDoc(Appointment)
const getAllAppointments = getAllData(Appointment)
const cancelAppointment = deleteDoc(Appointment)

module.exports = {
    getOneAppointment,
    getAllAppointments,
    getAppointmentForPatient,
    getAppointmentForDoctor,
    cancelAppointment,
    makeAppointment,
    makeAppointmentFinished,
    getAppointmentForDay
    //editAppointmentInfo
}