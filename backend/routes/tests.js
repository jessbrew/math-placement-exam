const express = require("express");
const sql = require("mssql");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/submit_test", async (req, res) => {
    // {
    // "student_id":"16"
    // }
    try {
        if (req.body["student_id"] === undefined || req.body["student_id"] === null) {
            res.status(400).send({ error: "Missing parameter" });
        } else {
            dbConn.connect().then(async function () {
                var request = new sql.Request(dbConn);
                request.query(
                    `SELECT s.student_id, s.test_id, q.question_text FROM students s INNER JOIN test_questions tq ON tq.test_id = s.test_id INNER JOIN questions q ON q.question_id = tq.question_id WHERE s.student_id = ${req.body["student_id"]}`,
                    function (err, data) {
                        if (data === undefined) {
                            throw TypeError("Content is undefined");
                        }
                        let test = data.recordset;
                        test = Array.from(test);
                        let len = 0;
                        for (let i in test) {
                            len++;
                        }
                        request.query(
                            `SELECT s.student_id, s.wlc_id, s.first_name, s.last_name, s.test_id, s.test_completed, s.advisor, sa.time_submitted, a.is_correct, a.answer_text,q.question_text FROM students s INNER JOIN student_answers sa ON s.student_id = sa.student_id INNER JOIN answers a ON sa.answer_id = a.answer_id INNER JOIN questions q ON q.question_id = a.question_id WHERE s.student_id = ${req.body["student_id"]}`,
                            function (err, data) {
                                if (data === undefined) {
                                    throw TypeError("Content is undefined");
                                }
                                let test = data.recordset;
                                test = Array.from(test);
                                let correct = 0;
                                for (i in test) {
                                    if (test[i]["is_correct"] == "1") {
                                        correct++;
                                    }
                                }
                                request.query(
                                    `UPDATE students SET test_completed = 1 WHERE student_id  = ${req.body["student_id"]};`
                                );
                                res.send(`${correct} / ${len}`);
                            }
                        );
                    }
                );
            });
        }
    } catch {}
});

module.exports = router;
