const express = require("express")
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
router.get("/pastcourse/all", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        console.log("connected")
        var request = new sql.Request(dbConn);
        request.query("select * from past_courses", function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            console.log(result)
            res.send(result)
        });
    })
})

module.exports = router