const mongoose = require("mongoose");
const validator = require("validator")

const medicineSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required!"],
        minlength: [2, "Name is too short!"],
        unique: true
    },
    pharmacy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharamcy'
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    photo: {
        type: String,
        default: "default-medicine.jpg"
    },
    available: {
        type: Boolean,
        default: true
    },
    strength: {
        type: String,
        required: [true, "Strength is required!"]
    },
    category: {
        type: String,
        enum: ["Pain Relief", "Antibiotics", "Antipyretics", "Antacids", "Antihistamines", "Antidepressants", "Anticoagulants", "Antidiabetics", "Antipsychotics", "Vaccines", "Other"],
        required: [true, "Category is required!"]
    },
    price: {
        type: String,
        required: [true, "Price is required!"]
    },
    manufacturer: {
        type: String,
        required: [true, "Manufacturer is required!"]
    },
    expiry_date: {
        type: String,
        required: [true, "Expiry date is required!"],
        select: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Medicine', medicineSchema);