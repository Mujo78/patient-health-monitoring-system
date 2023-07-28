const mongoose = require('mongoose')
const Hospital = require("./models/hospital")
const User = require("./models/user")
const asyncHandler = require('express-async-handler')
const connectDB = require('./config/db')
const dotenv = require("dotenv").config()

connectDB()

const hospitalData = {
    name: process.env.H_NAME,
    address: process.env.H_ADDRESS,
    description: process.env.H_DESCRIPTION,
    phone_number: process.env.H_PHONE_NUMBER,
    email: process.env.H_EMAIL,
    password: process.env.H_PASSWORD
}


const seedDb = asyncHandler( async () =>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const image = 'default.jpg'
        const existingOne = await Hospital.find();
        
        if(existingOne.length === 0){
            
            const newUserHospital = await User.create([{
                email: hospitalData.email,
                role: 'HOSPITAL',
                photo: image,
                password: hospitalData.password,
                passwordConfirm: hospitalData.password
            }], {session})
    
            const newHospital = await Hospital.create([{
                user_id: newUserHospital[0]._id,
                name: hospitalData.name,
                address: hospitalData.address,
                description: hospitalData.description,
                phone_number: hospitalData.phone_number
            }], {session})
    
            console.log(`Hospital: ${newHospital[0].name} successfully created!`)
            
            await session.commitTransaction()
            session.endSession()

        }
    }catch(err){
        await session.abortTransaction()
        session.endSession()

        console.log(err.message)
    }


})

seedDb().then(() => {
    mongoose.disconnect()
})