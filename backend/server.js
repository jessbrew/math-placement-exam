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
app.use("/", (testConn = require("./routes/testConnection")));
app.use("/", (pastCourses = require("./routes/pastCourses")));
app.use("/", (submit = require("./routes/surveySubmit")));
app.use("/", (start = require("./routes/startTest")));
app.use("/", (submitAnswer = require("./routes/submitAnswer")));
app.use("/", (complete = require("./routes/testComplete")));





module.exports = app;
