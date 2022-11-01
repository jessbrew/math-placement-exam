const express = require("express");
const req = require("express/lib/request");
const sql = require('mssql')
const winston = require('winston')
const { combine, timestamp, json } = winston.format;
// const routes = require("../backend/routes")

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
var app = express()
const router = express.Router()

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

router.get("/students/all", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        logger.info("connected")
        var request = new sql.Request(dbConn);
        request.query("select * from students", function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            logger.info(result)
            if (err) {
                res.send("Bad request")
                res.status(400)
            }
            else {
                res.send(result)
            }
        });
    })
})

router.get("/students/:id", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        logger.info("connected")
        var request = new sql.Request(dbConn);
        request.query(`select * from students where wlc_id = ${req.params.id}`, function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            logger.info(result)
            if (err) {
                res.send("Bad request")
                res.status(400)
            }
            else {
                res.send(result).status(200)
            }
        });
    })
})
router.post("/students/login", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        logger.info("connected")
        var request = new sql.Request(dbConn);
        request.query(`select * from students where wlc_id = ${req.body.id}`, function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            if (err) {
                res.send("Bad request")
                res.status(400)
            }
            else if (test.length == 0) {
                request.query(`INSERT INTO students(wlc_id, first_name, last_name) VALUES(${req.body.id}, '${req.body.fname}', '${req.body.lname}'); SELECT * from students where wlc_id = ${req.body.id}`, function (err, data) {
                    let entries = data.recordset
                    let test = Array.from(entries)
                    let retObj = {
                        new: true,
                        student_id: test[0].student_id,
                        question_id: null,
                        test_id: null,
                        completed: false,
                        test_started_on: null,
                        updated_on: null
                    }
                    res.send(retObj).status(200)
                })
                logger.info("Inserted")
            }
            else {
                for (i = 0; i < test.length; i++) {
                    result.push(test[i])
                }
                logger.info({ result })
                let retObj = {
                    new: false,
                    student_id: result[0].student_id,
                    question_id: null,
                    test_id: null,
                    completed: false,
                    test_started_on: null,
                    updated_on: null
                }
                res.send(retObj).status(200)
            }
        });
    })
})
module.exports = router