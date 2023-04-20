const express = require("express");
const sql = require("mssql");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/students/login", async (req, res) => {
    // {
    // "warrior_id": 1234321,
    // "first_name": "Jimmy",
    // "last_name": "Dean"
    // }
    try {
        if (req.body["warrior_id"] === undefined || req.body["warrior_id"] === null) {
            res.status(400).send({ error: "Missing ID parameter" });
        } else if (req.body["first_name"] === undefined || req.body["first_name"] === null) {
            res.status(400).send({ error: "Missing First name parameter" });
        } else if (req.body["last_name"] === undefined || req.body["last_name"] === null) {
            res.status(400).send({ error: "Missing Last name parameter" });
        } else {
            let result = [];
            dbConn.connect().then(async function () {
                logger.info("connected to db at /students/loging");
                var request = new sql.Request(dbConn);
                request.query(
                    `select * from students where wlc_id = ${req.body["warrior_id"]}`,
                    function (err, data) {
                        let entries = data.recordset;
                        let test = Array.from(entries);
                        if (err) {
                            res.send("Bad request");
                            res.status(400);
                        } else if (test.length == 0) {
                            request.query(
                                `INSERT INTO students(wlc_id, first_name, last_name) VALUES(${req.body["warrior_id"]}, '${req.body["first_name"]}', '${req.body["last_name"]}'); SELECT * from students where wlc_id = ${req.body["warrior_id"]}`,
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
                    }
                );
            });
        }
    } catch {}
});
module.exports = router;
