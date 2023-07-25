
const asyncHandler = require("express-async-handler")
const User = require("../models/user");
const jwt = require("jsonwebtoken");


const protect = asyncHandler (async (req, res, next) => {
    let token;

    if(req.headers.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) return res.status(401).json("You are not logged in! PLease log in!")

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if(!user) return res.status(401).json("There was a problem with token!")

    req.user = user;

    next()
})


const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json("You are not authorized for this action!")
        }
        next()
    }

}

module.exports = {
    protect, 
    restrictTo
}