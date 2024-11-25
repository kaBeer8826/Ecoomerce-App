const express = require("express")
const ErrorHandler = require("./middleware/error")
const app = express()
const cookierParser = require('cookie-parser')
const bodyParser = require("body-parser")
const cors = require("cors")
app.use(express.json())
app.use(cookierParser())
app.use(cors())
app.use("/",express.static("uploads"))
app.use(bodyParser.urlencoded({extended:true}))


if(process.env.NODE_ENV !== "production"){
    require("dotenv").config({
        path:"server/config/.env"
    })
}
//imports routes
const user= require("./controller/user")

app.use("/api/v2/user", user);
//its fro error handling

app.use(ErrorHandler)
module.exports = app