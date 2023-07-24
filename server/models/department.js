const mongoose = require("mongoose");
const validator = require("validator")

const departmentSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required!"],
        unique: [true, 'Name must be unique!'],
    },
    description:{
        type: String,
        required: [true, "Description is required!"]
    },
    doctors:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'}
    ],
    phone_number: {
        type: String,
        required: [true, "Phone number is required!"],
        unique: [true, "Phone number must be unique"],
        maxlength: 12,
        validate: {
            validator: async function(){
                return validator.isMobilePhone(this.phone_number)
            },
            message: "Phone number must be valid!"
        }
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Department', departmentSchema);