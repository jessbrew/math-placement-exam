const express = require("express")
const sql = require('mssql')
const dotenv = require('dotenv')
const res = require("express/lib/response")
fs = require("fs")
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
    console.log("Start")
    result = getAnswers()
    console.log(result)
    console.log("End")
    // console.log(resultGet)
    // console.log(dbConfig)
    res.send("Here are your answers")
})
// router.get("/answers/all", async (req, res) => {
//     res.send("Here are all your answers")
//     // let resu = getAllAnswers()
//     // console.log(resu)
// })
function getAnswers() {
    let result = []
    let resData = ""
    var dbConn = new sql.ConnectionPool(dbConfig);
    // var dbConn = new sql.Connection(dbConfig);
    dbConn.connect()
        .then(async function () {
            console.log("connected")
            var request = new sql.Request(dbConn);
            request.query("select * from answers", function (err, data) {
                let entries = data.recordset
                let test = Array.from(entries)
                for (i = 0; i < test.length; i++) {
                    // result.push(toString(test[i]))
                    result.push(test[i])
                }
                console.log(result)
            });
            // console.log(data)
        })
    return resData
}
module.exports = router