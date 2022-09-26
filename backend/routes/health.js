const express = require("express")
const sql = require('mssql')
const dotenv = require('dotenv')
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

function getConn() {
    var dbConn = new sql.ConnectionPool(dbConfig);
    // var dbConn = new sql.Connection(dbConfig);
    dbConn.connect().then(function () {
        console.log("Connected")
    }).catch(function (err) {
        console.log(err);
    });
}

router.get("/health", (req, res) => {
    res.send("This is your daily health check")
    getConn()
})
module.exports = router