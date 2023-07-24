const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required!"],
        unique: [true, 'Email must be unique!'],
        lowercase: true,
        maxlength: 100,
        validate: [validator.isEmail, "Please provide valid email!"]
    },
    role:{
        type: String,
        enum: ["doctor", "hospital", "patient", "pharmachy"],
        required: [true, "Role is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minlength: 5,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm password is required!"],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: "Paswords are not the same!"
        }
    },
})


module.exports = mongoose.model('User', userSchema);