const express = require("express")
const sql = require('mssql')
var app = express()
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
router.post("/datacheck/all", async (req, res) => {
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        var request = new sql.Request(dbConn);
        request.query("SELECT q.question_id, q.question_text, qt.type_title, qs.status, qs.description, a.answer_id, a.answer_text,a.is_correct FROM questions q INNER JOIN question_status qs ON q.question_id = qs.question_id INNER JOIN question_types qt ON q.question_type = qt.question_type_id INNER JOIN answers a ON q.question_id = a.question_id;", function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            res.send(result)
        });
    })
})

router.post("/datacheck/update", async (req, res) => {
// Sample of how to send
//{
//     "question_id":1,
//     "status":1,
//     "description":"This is a test"
// }
    let result = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function(){
        var request = new sql.Request(dbConn);
        request.query(`UPDATE question_status SET status = ${req.body['status']}, description = '${req.body['description']}' WHERE question_id = ${req.body['question_id']}; SELECT * FROM question_status WHERE question_id = ${req.body['question_id']};`, function (err, data){
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                result.push(test[i])
            }
            res.send(result)
        });
    })
})

module.exports = router