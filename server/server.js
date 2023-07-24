
const connectDB = require("./config/db")
const app = require("./index")
const dotenv = require("dotenv")
dotenv.config()

connectDB()

const port = process.env.PORT || 3001

app.listen(port, () => {console.log(`Server working on port: ${port}`)})


