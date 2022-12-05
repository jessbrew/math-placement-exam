const express = require('express')
const dotenv = require('dotenv')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
var app = express(), bodyParser = require("body-parser")
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(bodyParser.json());
dotenv.config()

app.use("/", health = require("./routes/health.js"))
app.use("/", answers = require("./routes/answers.js"))
app.use("/", tests = require("./routes/tests.js"))
app.use("/", students = require("./routes/students"))
app.use("/", test_questions = require("./routes/test_questions.js"))
app.use("/", student_answers = require("./routes/student_answers.js"))
app.use("/", questions = require("./routes/questions.js"))
app.use("/", question_type = require("./routes/question_type"))
app.use("/", past_courses = require("./routes/past_courses.js"))
app.use("/", student_past_courses = require("./routes/student_past_courses"))
app.use("/", questionaire = require("./routes/questionaire"))


module.exports = app