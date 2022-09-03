const express = require("express")
const sql = require('mssql')
const dotenv = require('dotenv')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
// const routes = require("../backend/routes")
var cors = require('cors');
dotenv.config()
var app = express(), bodyParser = require("body-parser")
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
//Routes 
const health = require("./routes/health.js")
const answers = require("./routes/answers.js")
const req = require("express/lib/request")

//Specifying ports
PORT = 3000
app.use(bodyParser.json());
app.use("/", health)
app.use("/", answers)

app.listen((PORT), () => {
    console.log("Server is running on port:" + PORT)
})

// require('./routes')(app)