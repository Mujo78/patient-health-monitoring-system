const mongoose = require("mongoose");
const validator = require("validator")

const notificationSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: 5,
        maxlength: 120
    },
    content: {
        type: String,
        required: [true, 'Content is required!'],
        minlength: 5,
        maxlength: 120
    },
    type:{
        type: String,
        enum: ["MESSAGE", "ALERT"],
        required: [true, "Type is required!"]
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Notification', notificationSchema);