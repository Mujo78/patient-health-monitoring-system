
const { getAllData, deleteDoc, updateDoc } = require("./handleController")
const Pharmacy = require("../models/pharmacy")
const asyncHandler = require("express-async-handler")
const { default: mongoose } = require("mongoose")
const User = require("../models/user")

const getPharmacy = getAllData(Pharmacy)

const addPharmacy = asyncHandler( async (req, res) =>{
    
    if(req.file) req.body.photo = req.file.filename

    const {
        name,email, photo, password, passwordConfirm,passwordChangedAt, address, description, phone_number, working_hours
    } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try{

        const user = await User.create({
            email,
            photo: photo ? photo : 'default.jpg',
            role: 'PHARMACY',
            password,
            passwordConfirm,
            passwordChangedAt
        })

        const newPharmacyData = await Pharmacy.create({
            name, address, user_id : user._id, description, phone_number, working_hours
        })

        if(newPharmacyData) return res.status(200).json(newPharmacyData)

        await session.commitTransaction()
        session.endSession()
    
    }catch(err) {
        await session.abortTransaction()
        session.endSession()

        return res.status(400).json(err.message)
    }
})


const deletePharmacy = deleteDoc(Pharmacy)
const updatePharmacy = updateDoc(Pharmacy)

module.exports = {
    getPharmacy,
    addPharmacy,
    deletePharmacy,
    updatePharmacy
}
