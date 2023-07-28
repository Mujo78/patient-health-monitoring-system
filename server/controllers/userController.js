const multer = require('multer')
const sharp = require('sharp')
const { v4 : uuidv4 } = require ('uuid');
const User = require("../models/user");
const asyncHandler = require('express-async-handler');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb( res.status(404).json("Your photo must be a type of image!"))
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

const uploadUserPhoto = upload.single('photo')

const resizeUserPhoto = (req, res, next) =>{
    if(!req.file) return next();
    
    req.file.filename = `user-${uuidv4()}.jpeg`

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`uploads/${req.file.filename}`)
    
    next()
}


const fillterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj;
}

const updateUserProfile = asyncHandler ( async(req, res) =>{
    
    if(req.body.password ||req.body.passwordConfirm) {
        return res.status(400).json("This route is not for updating password!")
    }

    const fillterBody = fillterObj(req.body, 'email', 'phone_number')
    if(req.file) fillterBody.photo = req.file.filename

    const user = await User.findByIdAndUpdate(req.params.id, fillterBody, {new: true, runValidators: true})

    return res.status(200).json(user)
})

const updateMe = asyncHandler(async (req, res) =>{
    
    if(req.body.password ||req.body.passwordConfirm) {
        return res.status(400).json("This route is not for updating password!")
    }

    const fillterBody = fillterObj(req.body, 'email', 'phone_number')
    if(req.file) fillterBody.photo = req.file.filename

    const user = await User.findByIdAndUpdate(req.user._id, fillterBody, {new: true, runValidators: true})

    return res.status(200).json(user)
})


module.exports = {
    uploadUserPhoto,
    resizeUserPhoto,
    updateUserProfile,
    updateMe
}