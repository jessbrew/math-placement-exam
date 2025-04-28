const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();
router.post("/startTest", async (req, res) => {
    // Request
    // { "student_id": 2, "test_id": 1 }
    try {
        if (req.body["student_id"] === undefined || req.body["student_id"] === null) {
            res.status(400).send({ error: "Missing student_id parameter" });
        } else if (req.body["test_id"] === undefined || req.body["test_id"] === null) {
            res.status(400).send({ error: "Missing test_id parameter" });
        } else {
            dbConn.connect().then(async function () {
                try {
                    const client = await dbConn.connect(); // Use the pg client
                    const updateQuery = `
                        UPDATE students
                        SET start_time = NOW()
                        WHERE student_id = $1;
                    `;
                    logger.info(`Updating start time for student_id: ${req.body["student_id"]}`);
                    await client.query(updateQuery, [req.body["student_id"]]);

                    const testQuery = `
                        SELECT 
                            q.question_id, 
                            q.question_text, 
                            a.answer_id, 
                            a.answer_text
                        FROM test_questions tq
                        INNER JOIN questions q ON tq.question_id = q.question_id
                        INNER JOIN answers a ON q.question_id = a.question_id
                        WHERE tq.test_id = $1
                        ORDER BY q.question_id, a.answer_id;
                    `;
                    const values = [req.body["test_id"]];
                    const result = await client.query(testQuery, values);
                    logger.info(`Fetched questions and answers for test_id: ${req.body["test_id"]}`);

                    // Process the result to format it as required
                    const questions = {};
                    result.rows.forEach(row => {
                        if (!questions[row.question_id]) {
                            questions[row.question_id] = {
                                question_id: row.question_id,
                                question_text: row.question_text,
                                answers: []
                            };
                        }
                        questions[row.question_id].answers.push({
                            answer_id: row.answer_id,
                            answer_text: row.answer_text
                        });
                    });
                    logger.info(`Formatted questions for test_id: ${req.body["test_id"]}`);

                    const timeLimitQuery = `
                        SELECT time_limit
                        FROM tests
                        WHERE test_id = $1;
                    `;
                    const timeLimitResult = await client.query(timeLimitQuery, [req.body["test_id"]]);
                    logger.info(`Fetched time limit for test_id: ${req.body["test_id"]}`);

                    // Convert the questions object to an array and send the response
                    const formattedQuestions = Object.values(questions);
                    // res.status(200).send(formattedQuestions);
                    res.status(200).send({
                        test_id: req.body["test_id"],
                        time_limit: timeLimitResult.rows[0],
                        questions: formattedQuestions,
                    });
                } catch (err) {
                    logger.error(`Database query error: ${err.message}`);
                    res.status(500).send({ error: "Internal Server Error" });
                }
            });
        }
    } catch (err) {
        logger.error(`Unexpected server error: ${err.message}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
module.exports = router;