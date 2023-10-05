const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator")

const doctorSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
        select: false
    },
    first_name:{
        type: String,
        required: [true, "First name is required!"],
        minlength: [2, "First name is too short!"]
    },
    last_name:{
        type: String,
        required: [true, "Last name is required!"],
        required: [true, "First name is required!"],
        minlength: [2, "First name is too short!"]
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
    speciality: {
        type: String,
        required: [true, "Speciality is required!"]
    },
    qualification: {
        type: String,
        required: [true, "Qualification is required!"]
    },
    bio: {
        type: String,
        required: [true, "Bio is required!"]
    },
    age: {
        type: String,
        required: [true, "Age is required!"]
    },
    available_days: {
        type: [{
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        }],
        required: true
    }
    
})

doctorSchema.plugin(uniqueValidator, {message: "Phone number taken!"})


doctorSchema.pre(/^find/, function(next) {
    this.populate({
      path: "user_id",
      select: "email photo"
    });
  
    next();
  });

module.exports = mongoose.model('Doctor', doctorSchema);