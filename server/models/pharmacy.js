const mongoose = require("mongoose");
const validator = require("validator")

const pharmacySchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name:{
        type: String,
        required: [true, "Name is required!"],
        unique: [true, 'Name must be unique!'],
    },
    address: {
        type: String,
        required: [true, "Address is required!"]
    },
    description:{
        type: String,
        required: [true, "Description is required!"]
    },
    medicine:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'Medicine'}
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
    },
    working_hours: {
        type: String,
        required: [true, "Working hours are required!"]
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Pharmacy', pharmacySchema);