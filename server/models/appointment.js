const mongoose = require("mongoose");
const validator = require("validator")

const appointmentSchema = mongoose.Schema({
    doctor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, "Doctor is required!"]
    },
    patient_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, "Patient is required!"]
    },
    diagnose:{
        type: String, 
        required: false,
        default: ""
    },
    therapy: {
        type: String,
        required: false,
        default: ""
    },
    medicine_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: false
    },
    description: {
        type: String, 
        required: false,
        default: ""
    },
    reason: {
        type: String, 
        required: false
    },
    appointment_date: {
        type: Date,
        required: [true, "Date of an appointment is required!"]
    },
    appointment_time: {
        type: String,
        required: [true, "Time of an appointment is required!"],
        match: [/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, "Invalid time format (HH:mm or HH:mm:ss)"]
    },
    finished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Appointment', appointmentSchema);