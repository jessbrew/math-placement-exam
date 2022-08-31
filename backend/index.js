const express = require("express")
var app = express()
//Routes 
const health = require("./routes/health.js")

//Specifying ports
PORT = 3000
app.use("/", health)
app.listen((PORT), () => {
    console.log("Server is running on port:" + PORT)
})
