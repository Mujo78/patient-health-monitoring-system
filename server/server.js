
const connectDB = require("./config/db")
const app = require("./index")
const dotenv = require("dotenv")
const morgan = require("morgan")
dotenv.config()

connectDB()

const port = process.env.PORT || 3001
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

console.log(process.env.NODE_ENV)


app.listen(port, () => {console.log(`Server working on port: ${port}`)})


