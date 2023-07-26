const mongoose = require("mongoose");
const validator = require("validator")

const medicineSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required!"],
        minlength: [2, "Name is too short!"],
        unique: [true, "Name must be unique!"]
    },
    pharmacy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharamcy'
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
        enum: ["Pain Relief", "Antibiotics", "Antipyretics", "Antacids", "Antihistamines", "Antidepressants", "Anticoagulants", "Antidiabetics", "Antipsychotics", "Vaccines", "Other"],
        required: [true, "Category is required!"]
    },
    price: {
        type: Number,
        required: [true, "Price is required!"]
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