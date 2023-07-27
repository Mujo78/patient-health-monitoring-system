const { getAllData, getDoc, updateDoc, deleteDoc } = require("./handleController")
const Medicine = require("../models/medicine")
const asyncHandler = require("express-async-handler")
const Pharmacy = require("../models/pharmacy")

const getMedicines = getAllData(Medicine)
const getMedicine = getDoc(Medicine)

const createMedicine = asyncHandler( async (req, res) => {

    const {
        name, description, strength, category, price, manufacturer, expiry_date
    } = req.body;

    const oldOne = await Medicine.findOne({name, category})
    if(oldOne) return res.status(400).json("Medicine already in database!")

    const ph = await Pharmacy.findOne()
    if(!ph) return res.status(400).json("There is no pharmacy for medicine!")

    const newMedicine = await Medicine.create({
        name,
        description,
        pharmacy_id: ph._id,
        strength,
        category,
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
    deleteMedicine
}