const asyncHandler = require("express-async-handler")
const { getAllData, deleteDoc, getDoc, getAllDocForUser } = require("./handleController")
const cron = require("node-cron")
const moment = require('moment-timezone');
const Appointment = require("../models/appointment")
const Patient = require("../models/patient")
const Doctor = require("../models/doctor")
const User = require("../models/user")
const Email = require("../utils/email");

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
    
    const overlappingAppointment = await Appointment.findOne({
        doctor_id: { $ne: doctor_id },
        patient_id: patient._id,
        appointment_date: new Date(appointment_date)
    });

    if (overlappingAppointment) return res.status(400).json("You already have an appointment with a different doctor at that time.");

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

    if(req.body.doctor_id || req.body.patient_id || req.body.reason || req.body.appointment_date){
        return res.status(404).json("You can't edit fields: reason, date of an appointment!")
    }

    const app = await Appointment.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    if(!app) return res.status(404).json("There was an error, please try again later!")
    
    return res.status(200).json(app)
})

const editAppointmentInfo = asyncHandler ( async (req, res) => {

    const appToEdit = await Appointment.findById(req.params.id)
    if(!appToEdit) return res.status(200).json("Appointment not found!")

    const patientEditing = await Patient.findById(appToEdit.patient_id)
    const currentUserPatient = await Patient.findOne({user_id: req.user._id})
    if(patientEditing._id.toString() !== currentUserPatient._id.toString()) return res.status(400).json("This is not your appointment, you can't edit it!")
    
    const appDate = new Date(appToEdit.appointment_date);
    if(appDate <= new Date()) return res.status(400).json("You can't edit past appointments!")

    const timeDifference = appDate - new Date();
    const minutesDifference = timeDifference / (1000 * 60);
    if (minutesDifference < 60) return res.status(400).json("You can't edit appointments within 1 hour of the appointment time.");
    
    const appointmentDateWithoutTime = moment(req.body.appointment_date).tz("Europe/Sarajevo").format("YYYY-MM-DD");

    const existingAppointment = await Appointment.findOne({
        doctor_id: appToEdit.doctor_id,
        patient_id: appToEdit.patient_id,
        appointment_date: { $gte: new Date(appointmentDateWithoutTime), $lt: new Date(moment(appointmentDateWithoutTime).add(1, 'day')) }
    });
    if (existingAppointment && req.body.reason === appToEdit.reason) return res.status(400).json("You already have an appointment with this doctor on this day.");
    
    const overlappingAppointment = await Appointment.findOne({
        doctor_id: { $ne: appToEdit.doctor_id },
        patient_id: appToEdit.patient_id,
        appointment_date: new Date(req.body.appointment_date),
    });
    if (overlappingAppointment) return res.status(400).json("You already have an appointment with a different doctor at that time.");
    
    if(req.body.reason) appToEdit.reason = req.body.reason
    if(req.body.appointment_date) appToEdit.appointment_date = req.body.appointment_date

    await appToEdit.save({validateBeforeSave: false});
    return res.status(200).json(appToEdit)
})

const getAppointmentForPatient = getAllDocForUser()

const getLatestAppointmentForPatient = asyncHandler( async (req, res) => {
    
    const patient = await Patient.findOne({user_id: req.params.patientUserId})
    const app = await Appointment.findOne({patient_id: patient._id, finished: true}).sort({appointment_date: -1})

    return res.status(200).json(app)
})

const getLatestAppointmentForPatientWithDoctor = asyncHandler( async (req, res) => {
    
    const {
        patient_id,
        appointment_id
    } = req.body;

    const doctor = await Doctor.findOne({user_id: req.params.id})
    if(!doctor) return res.status(404).json("This doctor is not in database!")

    const patient = await Patient.findById(patient_id)
    if(!patient) return res.status(404).json("This patient is not in database!")

    const currentAppointment = await Appointment.findById(appointment_id)
    const app = await Appointment.findOne({_id: {$ne: appointment_id}, appointment_date: {$lt: currentAppointment.appointment_date},  patient_id: patient._id, doctor_id: doctor._id,  finished: true}).sort({appointment_date: -1}).limit(1)

    if(!app) return res.status(404).json("No finished appointment found for this patient!")

    return res.status(200).json(app)
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

            if(user.notification === true){
                await new Email(user).send(subject, message)
    
                el.notification = true
                await el.save()
            }

        }catch(err) {
            console.log(err.message)
        }
    })
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

    return res.status(404).json("There was an error, please try again later!")

})

const getPatientsForDoctor = asyncHandler( async (req, res) => {

    const {page} = req.query;

    const doc = await Doctor.findOne({user_id: req.params.id})

    if(!doc) return res.status(404).json("That doctor doesn't exists!")

    const app = await Appointment.aggregate([
        { $match: { doctor_id: doc._id } },
        { $group: { _id: "$patient_id" } },
      ]);
    if(!app) return res.status(404).json("There are no patients right now!")

    const patientIds = app.map((item) => item._id);

    const LIMIT = 8;
    const startIndx = (Number(page) - 1) * LIMIT

    const total = patientIds.length;
    const patients = await Patient.find({ _id: { $in: patientIds } }).sort({_id: -1}).limit(LIMIT).skip(startIndx);
    
    return res.status(200).json({data: patients, currentPage: Number(page), numOfPages: Math.ceil(total / LIMIT)})
})


const getPatientsForDoctorBySearch = asyncHandler ( async (req, res) => {

    const {searchQuery, page} = req.query;

    const doc = await Doctor.findOne({user_id: req.params.id})
    if(!doc) return res.status(404).json("That doctor doesn't exists!")

    const app = await Appointment.aggregate([
        { $match: { doctor_id: doc._id } },
        { $group: { _id: "$patient_id" } },
    ]);
    if(!app) return res.status(403).json("There are no patients right now!")

    const patientIds = app.map((item) => item._id);

    const LIMIT = 8;
    const startIndx = (Number(page) - 1) * LIMIT  

    const [first, last] = searchQuery.split(' ') 
    const name = new RegExp(searchQuery.trim(), "i")

    const conditionals = [
        { first_name: name }, 
        { last_name: name },
    ]

    if(first && last) {
        conditionals.push({
            first_name: first,
            last_name: last
        })
    }

    const patients = await Patient.find(
        {$and : [
            { _id: { $in: patientIds }},
            {$or : conditionals}
        ]}
    ).sort({_id: -1}).limit(LIMIT).skip(startIndx);

    if(patients.length === 0) return res.status(403).json("There are no patients with such name!")
    
    const total = patients.length;  
    return res.status(200).json({data: patients, currentPage: Number(page), numOfPages: Math.ceil(total / LIMIT)})

})

const getFinishedAppointmentForPatient = asyncHandler (async (req, res) => {

    const {page} = req.query;

    const patient = await Patient.findById(req.params.id)
    if(!patient) return res.status(404).json("This patient doesn't exists!")

    const doctor = await Doctor.findOne({user_id : req.user._id})
    if(!doctor) return res.status(404).json("This doctor doesn't exists!")

    const LIMIT = 9;
    const startIndx = (Number(page) - 1) * LIMIT  

    const apps = await Appointment.find({
        patient_id: patient._id,
        doctor_id: doctor._id,
        finished: true
    }).select({
        __v:0,
        createdAt: 0,
        updatedAt:0,
        patient_id: 0,
        doctor_id: 0,
        finished: 0,
        notification: 0
    }).sort({appointment_date: -1}).limit(LIMIT).skip(startIndx);

    if(!apps) return res.status(404).json("There are no previous appointments for this patient.")
    
    const total = await Appointment.countDocuments({
        patient_id: patient._id,
        doctor_id: doctor._id,
        finished: true,
      });
    return res.status(200).json({currentPage: Number(page), numOfPages: Math.ceil(total / LIMIT), patient_id: patient,  data: apps})

})

const getLatestFinishedAppointment = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    if(!user) return res.status(404).json('There is no user with such ID!')

    const patient = await Patient.findOne({user_id: user._id})    
    if(!patient) return res.status(404).json('There is no patient with such ID!')

    const latestApp = await Appointment.findOne({
        patient_id: patient._id,
        finished:true
    })
    .sort({appointment_date: -1})
    .select('appointment_date doctor_id')
    .exec()

    const latest = {}

    latest.patient = patient
    
    if(latestApp){
        latest.appointment = {
            _id: latestApp._id,
            doctor_id: latestApp.doctor_id,
            appointment_date: latestApp.appointment_date
        }
    }

    return res.status(200).json(latest)
})

const numberOfAppointmentsPerMonthForDepartments = asyncHandler( async(req, res) => {

    const {month} = req.params;

    const user = await User.findById(req.user._id)
    if(!user) return res.status(404).json('There is no user with such ID!')

    const patient = await Patient.findOne({user_id: user._id})    
    if(!patient) return res.status(404).json('There is no patient with such ID!')

    let year = new Date().getFullYear()
    let newYearMonth;
    const start = new Date(`${year}/${month}/01 GMT`)
    if(start.getMonth() + 2 === 13){
        newYearMonth = 1
        year++
    }else{
        newYearMonth = start.getMonth() + 2
    }
    const end = new Date(`${year}/${newYearMonth}/01 GMT`)

    const result = await Appointment.aggregate([
        {
            $match: {
                patient_id: patient._id,
                appointment_date: { $gte: start, $lt: end },
            },
        },
        {
            $lookup: {
                from: 'doctors',
                localField: 'doctor_id',
                foreignField: '_id',
                as: 'doctor',
            },
        },
        {
            $unwind: '$doctor',
        },
        {
            $group: {
                _id: '$doctor.speciality',
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                name: '$_id',
                count: 1,
                _id: 0,
            },
        },
    ]);

    const allSpecialties = await Doctor.distinct('speciality');

    const counts = {};

    allSpecialties.forEach((specialty) => {
        counts[specialty] = 0;
    });

    result.forEach((item) => {
        counts[item.name] = item.count;
    });

    const final = Object.keys(counts).map((name) => ({
        name,
        visited: counts[name],
    })).sort((a,b) => b.visited - a.visited).slice(0, 5);

    return res.status(200).json(final);

})

const getOneAppointment = getDoc(Appointment)
const getAllAppointments = getAllData(Appointment)
const cancelAppointment = deleteDoc(Appointment)

module.exports = {
    getOneAppointment,
    getAllAppointments,
    getAppointmentForPatient,
    cancelAppointment,
    makeAppointment,
    makeAppointmentFinished,
    getAppointmentForDay,
    editAppointmentInfo,
    getLatestAppointmentForPatient,
    getLatestAppointmentForPatientWithDoctor,
    getPatientsForDoctor,
    getPatientsForDoctorBySearch,
    getFinishedAppointmentForPatient,
    getLatestFinishedAppointment,
    numberOfAppointmentsPerMonthForDepartments
}