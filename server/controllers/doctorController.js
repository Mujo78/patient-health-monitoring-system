const { getAllData, updateDoc, getDoc } = require("./handleController")
const Doctor = require("../models/doctor")
const asyncHandler = require("express-async-handler")
const Hospital = require("../models/hospital")
const User = require("../models/user")
const { default: mongoose } = require("mongoose")

const addDoctor = asyncHandler( async (req, res) =>{

    const {
        first_name, last_name, photo, phone_number, address, speciality, qualification, bio
    } = req.body;

    
    const session = await mongoose.startSession()
    session.startTransaction()
    const email = req.user.email;
    const docEmail = email.slice(email.indexOf('@'))
    
    const emailID = phone_number.substr(phone_number.length - 3, phone_number.length)
    
    try{
        const newUserDoctor = await User.create([{
            email: `${first_name}.${last_name + emailID + docEmail}`,
            role: 'DOCTOR',
            photo: photo ? photo : "",
            password: first_name + "." + last_name,
            passwordConfirm: first_name + "." + last_name
        }], {session})
        
        const newDoctor = await Doctor.create([{
            first_name, user_id: newUserDoctor[0]._id, department_id: req.params.departmentId, last_name, phone_number, address, speciality, qualification, bio
        }], {session})

        await session.commitTransaction()
        session.endSession()
    
        return res.status(200).json(newDoctor)
    }catch(err){
        await session.abortTransaction()
        session.endSession()

        return res.status(400).json(err.message)
    }
    
})

const getAllDoctors = asyncHandler( async (req, res) => {

    let filter = {}
    console.log(req.params)
    if(req.params.departmentId){
        filter = {
            department_id: req.params.departmentId
        }
    }
    const doctors = await Doctor.find(filter)

    if(!doctors) return res.status(404).json("There was an error!")

    return res.status(200).json(doctors)

})

const getDoctor = getDoc(Doctor)
const updateDoctor = updateDoc(Doctor)
const deleteDoctor = asyncHandler( async (req, res) =>{

    const doc = await Doctor.findById(req.params.id)
    if(!doc) return res.status(400).json("There was an error!")

    const user = await User.findByIdAndUpdate(doc.user_id, {active: false}, {new: true})

    return res.status(200).json(user)

})

module.exports = {
    addDoctor,
    getAllDoctors,
    getDoctor,
    updateDoctor,
    deleteDoctor
}