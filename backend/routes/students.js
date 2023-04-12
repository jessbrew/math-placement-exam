const express = require("express");
const sql = require("mssql");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/students/:id", async (req, res) => {
    let result = [];
    dbConn.connect().then(async function () {
        logger.info("connected to db at /students/:id");
        var request = new sql.Request(dbConn);
        request.query(`select * from students where wlc_id = ${req.params.id}`, function (err, data) {
            let entries = data.recordset;
            let test = Array.from(entries);
            for (i = 0; i < test.length; i++) {
                result.push(test[i]);
            }
            logger.info("Data pulled from /students/:id");
            if (err) {
                res.send("Bad request");
                res.status(400);
            } else {
                res.send(result).status(200);
            }
        });
    });
});
router.post("/students/login", async (req, res) => {
    let result = [];
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(async function () {
        logger.info("connected to db at /students/loging");
        var request = new sql.Request(dbConn);
        request.query(`select * from students where wlc_id = ${req.body.id}`, function (err, data) {
            let entries = data.recordset;
            let test = Array.from(entries);
            if (err) {
                res.send("Bad request");
                res.status(400);
            } else if (test.length == 0) {
                request.query(
                    `INSERT INTO students(wlc_id, first_name, last_name) VALUES(${req.body.id}, '${req.body.fname}', '${req.body.lname}'); SELECT * from students where wlc_id = ${req.body.id}`,
                    function (err, data) {
                        let entries = data.recordset;
                        let test = Array.from(entries);
                        let retObj = {
                            new: true,
                            student_id: test[0].student_id,
                            question_id: null,
                            test_id: null,
                            completed: false,
                            test_started_on: null,
                            updated_on: null,
                        };
                        res.send(retObj).status(200);
                    }
                );
                logger.info("Inserted student");
            } else {
                for (i = 0; i < test.length; i++) {
                    result.push(test[i]);
                }
                logger.info({ result });
                let retObj = {
                    new: false,
                    student_id: result[0].student_id,
                    question_id: null,
                    test_id: null,
                    completed: false,
                    test_started_on: null,
                    updated_on: null,
                };
                res.send(retObj).status(200);
            }
        });
    });
});
module.exports = router;
