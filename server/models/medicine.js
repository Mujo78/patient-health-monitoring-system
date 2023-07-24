const mongoose = require("mongoose");
const validator = require("validator")

const medicineSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required!"],
        minlength: [2, "Name is too short!"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    strength: {
        type: String,
        required: [true, "Strength is required!"]
    },
    category: {
        type: String,
        required: [true, "Category is required!"]
    },
    price: {
        type: Number,
        required: [true, "Price is required!"],
        validate: {
            validator: async function(){
                return validator.isNumber(this.price)
            },
            message: "Price must be a number type!"
        }
    },
    manufacturer: {
        type: String,
        required: [true, "Manufacturer is required!"]
    },
    expiry_date: {
        type: Date,
        required: [true, "Expiry date is required!"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Medicine', medicineSchema);