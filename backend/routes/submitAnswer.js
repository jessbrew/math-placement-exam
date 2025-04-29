const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/submitAnswer", async (req, res) => {
    let client;

    // { "student_id": 2, "answer_id": 4 }
    try {
        if (req.body["student_id"] === undefined || req.body["student_id"] === null) {
            res.status(400).send({ status: "error", error: "Missing student_id parameter" });
        } else if (req.body["answer_id"] === undefined || req.body["answer_id"] === null) {
            res.status(400).send({ status: "error", error: "Missing answer_id parameter" });
        }
        try {
            client = await dbConn.connect(); // Use the pg client
            const updateQuery = `
                        INSERT INTO student_answers (student_id, answer_id, time_submitted)
                        VALUES ($1, $2, NOW());
                    `;
            const values = [req.body["student_id"], req.body["answer_id"]];
            await client.query(updateQuery, values);

            // Get the time the answer was submitted
            const selectQuery = `
                        SELECT time_submitted
                        FROM student_answers
                        WHERE student_id = $1 AND answer_id = $2;
                    `;
            const currentTimeResult = await client.query(selectQuery, values);
            const timeSubmitted = new Date(currentTimeResult.rows[0].time_submitted);

            // Get the test's time limit and the student's start time
            const maxTimeQuery = `
                        SELECT t.time_limit, s.start_time
                        FROM tests t
                        INNER JOIN students s ON t.test_id = s.test_id
                        WHERE s.student_id = $1;
                    `;
            const maxTimeResult = await client.query(maxTimeQuery, [req.body["student_id"]]);

            if (maxTimeResult.rows.length === 0) {
                res.status(400).send({ status: "error", error: "Test or student not found" });
                return;
            }

            const timeLimit = maxTimeResult.rows[0].time_limit; // Time limit in seconds
            const startTime = new Date(maxTimeResult.rows[0].start_time); // Start time as a Date object

            // Calculate elapsed time in seconds
            const elapsedTime = (timeSubmitted - startTime) / 1000; // Difference in milliseconds, converted to seconds

            // Compare elapsed time with the time limit
            if (elapsedTime > timeLimit) {
                logger.error(`Elapsed time exceeded the limit: ${elapsedTime} seconds`);
                res.status(200).send({ status: "time" });
            } else {
                logger.info(`Elapsed time within limit: ${elapsedTime} seconds`);
                res.status(200).send({ status: "ok" });
            }
        } catch (err) {
            logger.error(`Database query error: ${err.message}`);
            res.status(500).send({ status: "error", error: "Internal Server Error" });
        }

    } catch (err) {
        logger.error(`Unexpected server error: ${err.message}`);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    } finally {
        client.release();
    }
});
module.exports = router;