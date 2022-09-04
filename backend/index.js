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
const tests = require("./routes/tests.js")
const students = require("./routes/students")
const test_questions = require("./routes/test_questions.js")
const student_answers = require("./routes/student_answers.js")
const questions = require("./routes/questions.js")
const question_type = require("./routes/question_type")
const past_courses = require("./routes/past_courses.js")
const student_past_courses = require("./routes/student_past_courses")
const req = require("express/lib/request")

//Specifying ports
PORT = 3000
app.use(bodyParser.json());
app.use("/", health)
app.use("/", answers)
app.use("/", tests)
app.use("/", students)
app.use("/", test_questions)
app.use("/", student_answers)
app.use("/", questions)
app.use("/", question_type)
app.use("/", past_courses)
app.use("/", student_past_courses)

app.listen((PORT), () => {
    console.log("Server is running on port:" + PORT)
})

// require('./routes')(app)