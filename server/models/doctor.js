const mongoose = require("mongoose");
const validator = require("validator");
const user = require("./user");

const doctorSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department_id: {
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
        required: [true, "First name is required!"],
        minlength: [2, "First name is too short!"]
    },
    phone_number: {
        type: String,
        required: [true, "Phone number is required!"],
        unique: [true, "Phone number must be unique"],
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
    }
    
})


doctorSchema.pre(/^find/, function(next) {
    this.populate({
      path: "user_id",
      select: "email"
    });
  
    next();
  });

module.exports = mongoose.model('Doctor', doctorSchema);