const express = require("express");
const req = require("express/lib/request");
const sql = require('mssql')
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
        console.log("connected")
        var request = new sql.Request(dbConn);
        request.query("select * from students", function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            console.log(result)
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

router.post("/students/test", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        console.log("connected")
        var request = new sql.Request(dbConn);
        request.query("INSERT INTO students(wlc_id,first_name, last_name) VALUES('1423527', 'Your', 'Mom')", function (err, data) {
            res.send("Rows affected: " + data.rowsAffected)
        })
    })
})

router.get("/students/:id", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        console.log("connected")
        var request = new sql.Request(dbConn);
        request.query(`select * from students where wlc_id = ${req.params.id}`, function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            console.log(result)
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
        console.log("connected")
        var request = new sql.Request(dbConn);
        request.query(`select * from students where wlc_id = ${req.params.id}`, function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            console.log(result)
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
module.exports = router