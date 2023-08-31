const mongoose = require("mongoose");
const validator = require("validator")

const departmentSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required!"],
        unique: [true, 'Name must be unique!'],
    },
    /*
    hospital_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        select: false
    },
    */
    description:{
        type: String,
        required: [true, "Description is required!"],
        minlength: [10, "Description is too short!"]
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
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Department', departmentSchema);