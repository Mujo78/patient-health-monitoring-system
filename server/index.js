const express = require("express")
const morgan = require("morgan")

const app = express();

const userRoutes = require("./routes/userRoutes")
const medicineRoutes = require("./routes/medicineRoutes")
const pharmacyRoutes = require("./routes/pharmacyRoutes")
const departmentRoutes = require("./routes/departmentRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes")
const doctorRoutes = require("./routes/doctorRoutes")
const patientRoutes = require("./routes/patientRoutes")

const { errorHandler } = require("./middlewares/errorMiddleware");

// File for the routes

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())

app.use("/user", userRoutes)
app.use("/department", departmentRoutes)
app.use("/medicine", medicineRoutes)
app.use("/pharmacy", pharmacyRoutes)
app.use("/hospital", hospitalRoutes)
app.use("/doctor", doctorRoutes)
app.use("/patient", patientRoutes)

app.all('*', (req, res, next) =>{

    res.status(404).json(`Can't find ${req.originalUrl} on this server!`)
})

app.use(errorHandler)

module.exports = app