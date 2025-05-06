const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/surveySubmit", async (req, res) => {
    let client;
    // Request
    // { "user_code": 1234567,
    //  "first_name": "bob",
    //  "last_name": "smith",
    //  "email": "bob.smith@mail.wlc.edu",
    //  "past_courses": [
    //  {"past_course_id": 1},
    //  {"past_course_id": 2}
    //  ],
    //  "available_course_id": 1}
    try {
        if (req.body["user_code"] === undefined || req.body["user_code"] === null) {
            res.status(400).send({ error: "Missing student_code parameter" });
        } else if (req.body["first_name"] === undefined || req.body["first_name"] === null) {
            res.status(400).send({ error: "Missing first_name parameter" });
        } else if (req.body["last_name"] === undefined || req.body["last_name"] === null) {
            res.status(400).send({ error: "Missing last_name parameter" });
        } else if (req.body["email"] === undefined || req.body["email"] === null) {
            res.status(400).send({ error: "Missing email parameter" });
        } else if (req.body["past_courses"] === undefined || req.body["past_courses"] === null) {
            res.status(400).send({ error: "Missing past_courses parameter" });
        } else if (req.body["available_course_id"] === undefined || req.body["available_course_id"] === null) {
            res.status(400).send({ error: "Missing available_course_id parameter" });
        } else {

            try {
                client = await dbConn.connect(); // Use the pg client
                logger.info("connected to db at /submit");

                const testCompletedQuery = `
                    SELECT test_completed
                    FROM students
                    WHERE user_code = $1;`;

                const TSAPreCheckValues = [
                    req.body["user_code"],
                ];
                const testCompletedResult = await client.query(testCompletedQuery, TSAPreCheckValues);

                if (testCompletedResult.rows.length > 0 && testCompletedResult.rows[0].test_completed) {
                    res.status(200).send({ status: "Complete" });
                    return;
                } else if (testCompletedResult.rows.length > 0 && !testCompletedResult.rows[0].test_completed) {
                    const studentIDQuery = `
                        SELECT student_id
                        FROM students
                        WHERE user_code = $1;`;

                    const burnbookQuery1 = `
                        DELETE FROM student_past_courses
                        WHERE student_id = $1;`;

                    const burnbookQuery2 = `
                        DELETE FROM student_answers
                        WHERE student_id = $1;`;

                    const burnbookQuery3 = `
                        DELETE FROM students
                        WHERE student_id = $1;`;

                    const studentIDResult = await client.query(studentIDQuery, TSAPreCheckValues);
                    const studentId = studentIDResult.rows[0].student_id;

                    // Delete dependent records first to avoid foreign key constraint violations
                    await client.query(burnbookQuery1, [studentId]);
                    await client.query(burnbookQuery2, [studentId]);
                    await client.query(burnbookQuery3, [studentId]); // Delete the student record last
                    logger.info(`Deleted student with ID: ${studentId}`);
                }

                // Find the test
                const findTestQuery = `
                    SELECT test_id
                    FROM available_course
                    WHERE available_course_id = $1
                `;
                const findTestResult = await client.query(findTestQuery, [req.body["available_course_id"]])
                const test_id = findTestResult.rows[0].test_id;

                // Insert the student
                const insertQuery = `
                    INSERT INTO students (user_code, first_name, last_name, email, available_course_id, test_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING student_id;`;

                const values = [
                    req.body["user_code"],
                    req.body["first_name"],
                    req.body["last_name"],
                    req.body["email"],
                    req.body["available_course_id"],
                    test_id // Insert the highest past_course_id as test_id
                ];

                const result = await client.query(insertQuery, values);
                const studentId = result.rows[0].student_id;

                // Insert past courses
                const pastCourses = req.body["past_courses"];
                const vals = pastCourses.flatMap(course => [studentId, course.past_course_id]);
                const placeholders = pastCourses
                    .map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
                    .join(", ");
                const query = `INSERT INTO student_past_courses (student_id, past_course_id) VALUES ${placeholders}`;
                await client.query(query, vals);

                // Get the amount of time and question count
                const testQuery =  `
                    SELECT time_limit, (SELECT COUNT(*) FROM test_questions WHERE test_id = $1) AS "question_count"
                    FROM tests
                    WHERE test_id = $1`;

                const testValues = [test_id]
                const testResult = await client.query(testQuery, testValues);

                res.status(200).json({ status: "ok", student_id: studentId, test_id, time_limit: testResult.rows[0].time_limit, question_count: testResult.rows[0].question_count });
                logger.info(`Student added with ID: ${studentId}`);
            }
            catch (err) {
                logger.error(`Error: ${err}`);
                res.status(500).send({ error: "Internal Server Error" });
            }

        }
    }

    catch (err) {
        logger.error(`Error: ${err}`);
        res.status(500).send({ error: "Internal Server Error" });
    } finally {
        if (client){
            client.release();
        }
    }
});

module.exports = router;
