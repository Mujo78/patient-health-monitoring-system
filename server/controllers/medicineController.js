const { getAllData, getDoc, updateDoc, deleteDoc } = require("./handleController")
const Medicine = require("../models/medicine")
const asyncHandler = require("express-async-handler")
const Pharmacy = require("../models/pharmacy")
const sharp = require('sharp')

const resizeMedicinePhoto = (req, res, next) =>{
    if(!req.file) return next();
    
    req.file.filename = `${req.body.name}-${req.body.strength}.jpeg`

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`uploads/${req.file.filename}`)
    
    next()
}

const getMedicines = getAllData(Medicine)
const getMedicine = getDoc(Medicine)

const createMedicine = asyncHandler( async (req, res) => {

    if(req.file) req.body.photo = req.file.filename

    const {
        name, description, strength, category, price,photo, manufacturer, expiry_date
    } = req.body;

    const oldOne = await Medicine.findOne({name, category, strength})
    if(oldOne) return res.status(400).json("Medicine already in database!")

    const ph = await Pharmacy.findOne()
    if(!ph) return res.status(400).json("There is no pharmacy for medicine!")

    const newMedicine = await Medicine.create({
        name,
        description,
        pharmacy_id: ph._id,
        strength,
        category,
        photo,
        price,
        manufacturer,
        expiry_date
    })

    return res.status(200).json(newMedicine)
})

const updateMedicine = updateDoc(Medicine)
const deleteMedicine = deleteDoc(Medicine)

module.exports = {
    getMedicines,
    getMedicine,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    resizeMedicinePhoto
}