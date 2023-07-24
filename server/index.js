const express = require("express")
const morgan = require("morgan")

const app = express();

// File for the routes

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())


app.all('*', (req, res, next) =>{

    res.status(404).json(`Can't find ${req.originalUrl} on this server!`)
})

module.exports = app