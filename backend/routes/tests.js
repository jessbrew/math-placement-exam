const express = require("express");
const sql = require("pg");
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
                try {
                    const client = await dbConn.connect(); // Use the pg client
                    logger.info("connected to db at /submit_test");

                    // Query to get test questions
                    const testQuery = `
                        SELECT s.student_id, s.test_id, q.question_text 
                        FROM students s 
                        INNER JOIN test_questions tq ON tq.test_id = s.test_id 
                        INNER JOIN questions q ON q.question_id = tq.question_id 
                        WHERE s.student_id = $1;
                    `;
                    const testResult = await client.query(testQuery, [req.body["student_id"]]);

                    if (testResult.rows.length === 0) {
                        throw new TypeError("Content is undefined 1");
                    }

                    const test = testResult.rows;
                    const len = test.length;

                    // Query to get student answers and correctness
                    const answersQuery = `
                        SELECT s.student_id, s.test_id, s.test_completed, sa.time_submitted, a.is_correct, a.answer_text, q.question_text 
                        FROM students s 
                        INNER JOIN student_answers sa ON s.student_id = sa.student_id 
                        INNER JOIN answers a ON sa.answer_id = a.answer_id 
                        INNER JOIN questions q ON q.question_id = a.question_id 
                        WHERE s.student_id = $1;
                    `;
                    const answersResult = await client.query(answersQuery, [req.body["student_id"]]);

                    if (answersResult.rows.length === 0) {
                        throw new TypeError("Content is undefined 2");
                    }

                    const answers = answersResult.rows;
                    let correct = 0;

                    for (const answer of answers) {
                        if (answer["is_correct"] === true) {
                            correct++;
                        }
                    }

                    // Update the student's test completion status
                    const updateQuery = `
                        UPDATE students 
                        SET test_completed = 1 
                        WHERE student_id = $1;
                    `;
                    await client.query(updateQuery, [req.body["student_id"]]);

                    res.send(`${correct} / ${len}`);
                    logger.info(`Test completed for student_id: ${req.body["student_id"]}`);
                    client.release(); // Release the client back to the pool
                } catch (err) {
                    logger.error(`Error: ${err}`);
                    res.status(500).send({ error: "Internal Server Error" });
                }
            });
        }
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;