const multer = require('multer')
const sharp = require('sharp')
const path = require('path');
const { v4 : uuidv4 } = require ('uuid');
const User = require("../models/user")

// Not finished!

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
    
    req.file.filename = `user-${uuidv4()}.jpg`

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpg')
        .toFile(`data/img/${req.file.filename}`)
    
    next()
}

module.exports = {
    uploadUserPhoto,
    resizeUserPhoto
}