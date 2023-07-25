const express = require("express")
const morgan = require("morgan")

const app = express();

const userRoutes = require("./routes/userRoutes")
const departmentRoutes = require("./routes/department-routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

// File for the routes

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())

app.use("/", userRoutes)
app.use("/", departmentRoutes)

app.all('*', (req, res, next) =>{

    res.status(404).json(`Can't find ${req.originalUrl} on this server!`)
})

app.use(errorHandler)

module.exports = app