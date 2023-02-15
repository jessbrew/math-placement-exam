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
    // receivedCourses = await axios.get("http://localhost:3000/pastcourse/all")
    pastCourses = Array.from(receivedCourses.data)
    // logger.info(req.body)
    console.log(req.body['past_course_id'])

    dbConn.connect().then(async function () {
        var request = new sql.Request(dbConn);
        request.query(`select * from tests where test_id = ${req.body["past_course_id"]}`, function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            console.log(result)
            res.send(result)
        });
    })
    // res.sendStatus(200)
})

module.exports = router