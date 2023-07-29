const asyncHandler = require("express-async-handler")
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Patient = require("../models/patient");

const signToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createToken = (user, statusCode, res) =>{
    const token = signToken(user._id)

    user.password = undefined

    res.status(statusCode).json({
            token: token,
            data: user
        })
    }
const signup = asyncHandler( async (req, res) =>{
    
    if(req.file) req.body.photo = req.file.filename

    const {
        email, photo, password, passwordConfirm,
        first_name,
        last_name, phone_number,
        address, gender, blood_type, date_of_birth
    } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const newUser = await User.create([{
            email, role: 'PATIENT', photo : photo ? photo : "",
            password, passwordConfirm
        }], {session})

        const newPatient = await Patient.create([{
            user_id: newUser[0]._id,
            first_name, last_name, phone_number,
            address, gender, blood_type, date_of_birth
        }], {session})

        await session.commitTransaction()
        session.endSession()
    
        return res.status(200).json(newPatient)
    }catch(err) {
        await session.abortTransaction()
        session.endSession()

        return res.status(400).json(err.message)
    }

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
module.exports = {
    signup,
    login,
    changeMyPassword
}