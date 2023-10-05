const multer = require('multer')
const sharp = require('sharp')
const { v4 : uuidv4 } = require ('uuid');
const User = require("../models/user");
const Appointment = require("../models/appointment");
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

const updateMe = asyncHandler( async(req, res) =>{

    try {
       
        const updated = await User.findOneAndUpdate({_id: req.user._id}, req.body,{new: true, runValidators: true, context: 'query'})
        
        return res.status(200).json(updated)
    } catch (error) {
        return res.status(400).json(error.message)
    }

})

const updatePhoto = asyncHandler(async (req, res) =>{
    
    if(req.file) req.body.photo = req.file.filename

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {new: true, runValidators: true, context: 'query'})
    if(!user) return res.status(404).json('User doesn\'t\ exists')
    return res.status(200).json(user.photo)
})

const deactivateMyAccount = asyncHandler(async(req, res) =>{
    const {active} = req.body
    const user = await User.findById(req.user._id)
    if(!user) return res.status(404).json('User doesn\'t\ exists')

    user.active = active
    user.save()

    if(!user.active){
        const newApps = await Appointment.find({
            appointment_date: { $gte: new Date()}
        })

        if(newApps.length > 0){
            const ids = newApps.map((n) => n._id)
            await Appointment.deleteMany({_id: {$in: ids}})

        }
    }

    return res.status(200).json(user)
})


module.exports = {
    uploadUserPhoto,
    resizeUserPhoto,
    updateUserProfile,
    updateMe,
    updatePhoto,
    deactivateMyAccount
}