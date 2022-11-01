const express = require("express")
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
router.get("/answers", async (req, res) => {
    logger.info("hello")
})
router.get("/answers/topten", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        logger.info("connected")
        var request = new sql.Request(dbConn);
        request.query("select top 10 * from answers", function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            logger.info(result)
            res.send(result)
        });
    })
})

router.get("/answers/all", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        logger.info("connected")
        var request = new sql.Request(dbConn);
        request.query("select * from answers", function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            logger.info(result)
            res.send(result)
        });
    })
})

module.exports = router