const express = require("express")
const sql = require('mssql')
const dotenv = require('dotenv')
var cors = require('cors');
dotenv.config()
var app = express()

//Routes 
const health = require("./routes/health.js")
const answers = require("./routes/answers.js")

//Specifying ports
PORT = 3000
app.use("/", health)
app.use("/", answers)

app.listen((PORT), () => {
    console.log("Server is running on port:" + PORT)
})
