const asyncHandler = require("express-async-handler")
const crypto = require('crypto')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Pharmacy = require("../models/pharmacy")
const Email = require("../utils/email");

const signToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createToken = async (user, statusCode, res) =>{
    const token = signToken(user._id)

    let ModelToUse;
    if(user.role === 'PATIENT') ModelToUse = Patient
    else if(user.role === 'DOCTOR') ModelToUse = Doctor
    else ModelToUse = Pharmacy

    user.password = undefined

    const info = await ModelToUse.findOne({user_id: user._id})
    let inf = {}

    if(info.name){
        inf.name = info.name
    }else{
        inf.first_name = info.first_name,
        inf.last_name = info.last_name
    }

    res.status(statusCode).json({
            token: token,
            data: user,
            info: inf
        })
}
const signup = asyncHandler( async (req, res) =>{
    
    let newUser;
    let newPatient;

    if(req.file) req.body.photo = req.file.filename

    const {
        email, photo, password, passwordConfirm,
        first_name, passwordChangedAt,
        last_name, phone_number,
        address, gender, blood_type, date_of_birth
    } = req.body

    console.log(req.body)
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        newUser = await User.create([{
            email, role: 'PATIENT', photo : photo !== 'undefined' ? photo : "",
            password, passwordConfirm, passwordChangedAt
        }], {session})

        newPatient = await Patient.create([{
            user_id: newUser[0]._id,
            first_name, last_name, phone_number,
            address, gender, blood_type, date_of_birth
        }], {session})

        const verificationToken = newUser[0].createVerificationToken()
        
        await newUser[0].save({validateBeforeSave: false});

        const verifyURL = `${process.env.URL_LINK}api/v1/user/verify/${verificationToken}`
        const message = `Dear ${newPatient[0].first_name}, To verify your account please click on the link: ${verifyURL} (if this doesnt work, please copy/paste it in your browser)`
        const subject = 'Email verification (valid for 2 hours)'

        if(verificationToken) await new Email(newUser[0], newPatient[0].first_name).send(subject, message)

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json('Verification email has been sent!');

    }catch(err) {

        if(newPatient) await Patient.findByIdAndDelete(newPatient[0]._id)
        if(newUser) await User.findByIdAndDelete(newUser[0]._id)

        await session.abortTransaction()
        session.endSession()

        return res.status(400).json(err.message)
    }

})

const verifyEmail = asyncHandler( async (req, res) => {

    const tokenVerification = crypto.createHash('sha256').update(req.params.verificationToken).digest('hex')

    const user = await User.findOne({
        verificationToken: tokenVerification,
        verificationTokenExpires: {$gt: Date.now()}
    })

    if(!user) return res.status(400).json("Invalid or expired verification token!")

    user.isVerified = true;
    user.active = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save()

    try{
        const patient = await Patient.findOne({user_id: user._id})
        if(user.isVerified) await new Email(user, patient.first_name).sendWelcomeMessage()
        
    }catch(err){
        return res.status(404).json(err.message)
    }

    return res.status(200).json("Email successfully verified!")
})


const login = asyncHandler( async (req, res) => {

    const {
        email, password
    } = req.body;

    if(!email || !password){
        return res.status(400).json("Please provide email and password!")
    }

    const user = await User.findOne({email}).select('+password')

    if(!user || !(await user.correctPassword(password, user.password)) || user.active === false){
        return res.status(404).json("Incorrect password or email!")
    }

    createToken(user, 200, res)

})


const changeMyPassword = asyncHandler ( async (req, res) =>{

    const {
        currentPassword,
        newPassword,
        confirmNewPassword
    } = req.body;

    const user = await User.findById(req.user._id).select("+password")

    if(!(await user.correctPassword(currentPassword, user.password))){
        return res.status(400).json("Wrong password!")
    }

    user.password = newPassword
    user.passwordConfirm = confirmNewPassword
    await user.save()

    createToken(user, 200, res)
})



const forgotPassword = asyncHandler ( async (req, res) => {

    const user = await User.findOne({email: req.body.email})

    if(!user) return res.status(400).json("There is no user with that email address!")

    const resetToken = user.createPasswordResetToken()

    await user.save({validateBeforeSave: false})
    
    try{

        const resetURL = `${process.env.URL_LINK}api/v1/user/reset-password/${resetToken}`
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} \n If this is not you, please ignore this email!`
        const subject = 'Your password reset token (valid for 10 minutes)';

        if(resetToken) await new Email(user).send(subject, message)

        return res.status(200).json("Token successfully sent!")
    }catch(err){
        console.log(err)

        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save({validateBeforeSave: false});

        return res.status(404).json("There was an error, please try again later!")
    }
})

const resetPassword = asyncHandler(async (req, res) =>{
    
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}})

    if(!user) return res.status(400).json("Token is invalid or has expired!")

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    return res.status(200).json("Password reset: Success!")
})

module.exports = {
    signup,
    login,
    changeMyPassword,
    resetPassword,
    forgotPassword,
    verifyEmail
}