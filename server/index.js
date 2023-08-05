const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const app = express();

const userRoutes = require("./routes/userRoutes")
const medicineRoutes = require("./routes/medicineRoutes")
const pharmacyRoutes = require("./routes/pharmacyRoutes")
const departmentRoutes = require("./routes/departmentRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes")
const doctorRoutes = require("./routes/doctorRoutes")
const patientRoutes = require("./routes/patientRoutes")
const appointmentRoutes = require("./routes/appointmentRoutes")

const { errorHandler } = require("./middlewares/errorMiddleware");

// File for the routes

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/department", departmentRoutes)
app.use("/api/v1/medicine", medicineRoutes)
app.use("/api/v1/pharmacy", pharmacyRoutes)
app.use("/api/v1/hospital", hospitalRoutes)
app.use("/api/v1/doctor", doctorRoutes)
app.use("/api/v1/patient", patientRoutes)
app.use("/api/v1/appointment", appointmentRoutes)

app.all('*', (req, res, next) =>{

    res.status(404).json(`Can't find ${req.originalUrl} on this server!`)
})

app.use(errorHandler)

module.exports = app