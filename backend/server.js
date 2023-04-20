const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
var app = express(),
    bodyParser = require("body-parser");
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(bodyParser.json());
dotenv.config();

app.use("/", (health = require("./routes/health.js")));
app.use("/", (datacheck = require("./routes/datacheck.js")));
app.use("/", (answers = require("./routes/answers.js")));
app.use("/", (tests = require("./routes/tests.js")));
app.use("/", (students = require("./routes/students")));
app.use("/", (questionaire = require("./routes/questionaire")));

module.exports = app;
