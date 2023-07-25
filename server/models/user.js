const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")

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
        enum: ["DOCTOR", "HOSPITAL", "PATIENT", "PHARMACY"],
        required: [true, "Role is required!"]
    },
    photo:{
        type: String,
        required: false
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
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function(next){

    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

    next()
})

userSchema.methods.correctPassword = async function(typedPassword, userPassword){
    return await bcrypt.compare(typedPassword, userPassword)
}


module.exports = mongoose.model('User', userSchema);