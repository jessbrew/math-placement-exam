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
    // Pass in 
    // {
    //     "student_id":1234567,
    //     "past_course_id": 4,
    //     "most_advanced_class_taken":"a",
    //     "most_advanced_class_grade":"b",
    //     "desired_class":"math",
    //     "math_in_last_year":"one of them"
    // }
    
    let result = []
    let dbConn = new sql.ConnectionPool(dbConfig)
    try{
        dbConn.connect().then(async function () {
            var request = new sql.Request(dbConn);
            request.query(`SELECT test_id FROM past_courses pc INNER JOIN tests t ON pc.test_type = t.test_name WHERE past_course_id = ${req.body["past_course_id"]}`, function (err, data) {
                let test = data.recordset
                test = Array.from(test);
                if (test[0] == undefined){
                    res.sendStatus(400)
                }
                else{
                    let test_id = test[0]['test_id']
                    result.push({"test_id":test_id})
                    request.query(`
                    SELECT tq.question_id, q.question_text, a.answer_text 
                    FROM test_questions tq 
                    INNER JOIN tests t ON t.test_id = tq.test_id 
                    INNER JOIN questions q ON q.question_id = tq.question_id
                    INNER JOIN answers a ON a.question_id = q.question_id 
                    WHERE t.test_id = ${test_id}`, function (err, data){
                        let q = data.recordset
                        let questions = Array.from(q)
                        for (i = 0; i < questions.length; i++) {
                            result.push(questions[i])
                        }
                        res.send(result)
                    })
                }    
            });
        })
    }
    catch(err){
        console.log(`Error: ${err}`)
    }
})
module.exports = router