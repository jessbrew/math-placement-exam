const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

var app = express(),
    bodyParser = require("body-parser");
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(cors());
app.use(bodyParser.json());
dotenv.config();

app.use("/", (health = require("./routes/health.js")));
app.use("/", (datacheck = require("./routes/datacheck.js")));
app.use("/", (answers = require("./routes/answers.js")));
app.use("/", (tests = require("./routes/tests.js")));
app.use("/", (students = require("./routes/students")));
app.use("/", (questionaire = require("./routes/questionaire")));
app.use("/", (testConn = require("./routes/testConnection")));
app.use("/", (pastCourses = require("./routes/pastCourses")));
app.use("/", (submit = require("./routes/surveySubmit")));




module.exports = app;
