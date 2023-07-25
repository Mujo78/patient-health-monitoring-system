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
    
    const {
        email, role, photo, password, passwordConfirm, 
    } = req.body
    
    const newUser = await User.create({
        email: email,
        role: role,
        photo: photo ? photo : "",
        password: password,
        passwordConfirm: passwordConfirm
    })

    return newUser
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

module.exports = {
    signup,
    login
}