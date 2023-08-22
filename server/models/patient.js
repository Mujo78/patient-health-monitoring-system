const mongoose = require("mongoose");
const validator = require("validator")

const patientSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    first_name:{
        type: String,
        required: [true, "First name is required!"],
        minlength: [2, "First name is too short!"]
    },
    last_name:{
        type: String,
        required: [true, "Last name is required!"],
    },
    phone_number: {
        type: String,
        required: [true, "Phone number is required!"],
        unique: true,
        maxlength: 12,
        validate: {
            validator: async function(value){
                return validator.isMobilePhone(`${value}`)
            },
            message: "Phone number ({VALUE}) must be valid!"
        }
    },
    address: {
        type: String,
        required: [true, "Address is required!"]
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Gender is required!"]
    },
    height: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    blood_type: {
        type: String,
        required: [true, "Blood type is required!"]
    },
    date_of_birth: {
        type: Date,
        required: [true, "Date of birth is required!"]
    },
    health_card: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Appointment' 
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Patient', patientSchema);