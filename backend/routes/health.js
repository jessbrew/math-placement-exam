const express = require("express")
const sql = require('mssql')
const dotenv = require('dotenv')
var app = express()
const router = express.Router()
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

function getConn() {
    var dbConn = new sql.ConnectionPool(dbConfig);
    // var dbConn = new sql.Connection(dbConfig);
    dbConn.connect().then(function () {
        logger
        logger.info("Connected")
    }).catch(function (err) {
        logger.info(err);
    });
}

router.get("/health", (req, res) => {
    res.send("This is your daily health check")
    getConn()
})
module.exports = router