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
        unique: true,
    },
    address: {
        type: String,
        required: [true, "Address is required!"]
    },
    description:{
        type: String,
        required: [true, "Description is required!"]
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
    working_hours: {
        type: String,
        required: [true, "Working hours are required!"]
    }
}, {
    timestamps: true
})


pharmacySchema.pre('save', async function (next) {
    const count = await this.constructor.countDocuments();
    if(count === 1) {
        throw new Error('You can add only one pharmacy!')
    }
    next()
})

module.exports = mongoose.model('Pharmacy', pharmacySchema);