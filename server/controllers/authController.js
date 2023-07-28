const asyncHandler = require("express-async-handler")
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
        email, role, photo, password, passwordConfirm, 
    } = req.body
    
    const newUser = await User.create({
        email, role, photo,
        password, passwordConfirm
    })

    return res.status(200).json(newUser)
})


const login = asyncHandler( async (req, res) => {

    const {
        email, password
    } = req.body;

    if(!email || !password){
        return res.status(400).json("Please provide email and password!")
    }

    const user = await User.findOne({email}).select('+password')

    if(!user || !(await user.correctPassword(password, user.password))){
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