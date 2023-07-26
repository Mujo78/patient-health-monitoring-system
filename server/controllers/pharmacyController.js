
const { getAllData, createNewDoc, deleteDoc, updateDoc, getDoc } = require("./handleController")
const Pharmacy = require("../models/pharmacy")
const asyncHandler = require("express-async-handler")
const { signup } = require("./authController")

const getPharmacy = getAllData(Pharmacy)
const addPharmacy = asyncHandler( async (req, res) =>{
    
    const {
        name, user_id, address, description, phone_number, working_hours
    } = req.body

    const newPharmacyData = await Pharmacy.create({
        name, address, user_id : user_id, description, phone_number, working_hours
    })

    if(newPharmacyData) return res.status(200).json(newPharmacyData)

    return res.status(400).json("There was an error!")
})


const deletePharmacy = deleteDoc(Pharmacy)
const updatePharmacy = updateDoc(Pharmacy)

module.exports = {
    getPharmacy,
    addPharmacy,
    deletePharmacy,
    updatePharmacy
}
