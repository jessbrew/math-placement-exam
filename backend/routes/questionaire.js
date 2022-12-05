const express = require("express");
const req = require("express/lib/request");
const sql = require('mssql')
var app = express()
const router = express.Router()
const axios = require("axios")
const winston = require('winston')
const { combine, timestamp, json } = winston.format;

//Logging config
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({
            filename: 'logger.log',
        }),
    ],
});

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_Database,
    stream: false,
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};
router.post("/questionaire", async (req, res) => {
    let result = []
    let dbConn = new sql.ConnectionPool(dbConfig)
    receivedCourses = await axios.get("http://localhost:3000/pastcourse/all")
    pastCourses = Array.from(receivedCourses.data)
    for (i = 0; i < pastCourses.length; i++) {
        console.log(pastCourses[i])
    }
    logger.info(req.body)
    res.send(pastCourses)
    // res.sendStatus(200)
})
module.exports = router