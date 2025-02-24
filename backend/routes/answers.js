const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

function convertMillisecondsToMinutes(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000); // 1 minute = 60000 milliseconds
    return minutes;
}
function convertMillisecondsToSeconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000); // 1 second = 1000 milliseconds
    return seconds;
}

router.post("/submit_answer", async (req, res) => {
    // {
    // "student_id":"16",
    // "answer_id":"3"
    // }
    try {
        if (req.body["student_id"] === undefined || req.body["student_id"] === null) {
            res.status(400).send({ error: "Missing parameter" });
        } else if (req.body["answer_id"] === undefined || req.body["answer_id"] === null) {
            res.status(400).send({ error: "Please include a valid answer_id" });
        } else {
            dbConn.connect().then(async function () {
                var request = new sql.Request(dbConn);
                request.query(
                    `SELECT s.student_id, s.start_time, t.test_id, t.time_limit 
                    FROM students s 
                    INNER JOIN tests t ON s.test_id = t.test_id 
                    WHERE s.student_id = ${req.body["student_id"]}`,
                    function (err, data) {
                        if (data === undefined) {
                            throw TypeError("Content is undefined");
                        }
                        let test = data.recordset;
                        test = Array.from(test);
                        let time_limit = test[0]["time_limit"];
                        let startDate = new Date(test[0]["start_time"]);
                        let currentDate = new Date();
                        var diff = Math.abs(currentDate - startDate);
                        let elapsed_time_minutes = convertMillisecondsToMinutes(diff);
                        let elapsed_time_seconds = convertMillisecondsToSeconds(diff);
                        if (elapsed_time_seconds > time_limit) {
                            console.log(`OVERTIME by: ${elapsed_time_minutes - convertMillisecondsToMinutes(time_limit)} minutes`);
                            res.send("OVERTIME");
                        } else {
                            console.log(`ONTIME: ${elapsed_time_minutes - convertMillisecondsToMinutes(time_limit)} minutes remaining`);
                            res.send("ONTIME");
                        }
                    }
                );
                request.query(
                    `INSERT INTO student_answers (student_id, answer_id, time_submitted) VALUES (${req.body["student_id"]},${req.body["answer_id"]}, GETDATE());`
                );
            });
        }
    } catch {}
});
module.exports = router;
