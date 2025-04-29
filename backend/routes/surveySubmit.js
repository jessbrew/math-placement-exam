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
    //  "desired_class": "Calc 3"}
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
        } else if (req.body["desired_class"] === undefined || req.body["desired_class"] === null) {
            res.status(400).send({ error: "Missing desired_class parameter" });
        } else {

            try {
                client = await dbConn.connect(); // Use the pg client
                logger.info("connected to db at /submit");

                const TSAPreCheckQuery = `
                    SELECT *
                    FROM students
                    WHERE user_code = $1 AND email = $2 AND first_name = $3 AND last_name = $4;`;

                const testCompletedQuery = `
                    SELECT test_completed
                    FROM students
                    WHERE user_code = $1 AND email = $2 AND first_name = $3 AND last_name = $4;`;

                const TSAPreCheckValues = [
                    req.body["user_code"],
                    req.body["email"],
                    req.body["first_name"],
                    req.body["last_name"]
                ];
                const TSAPreCheckResult = await client.query(TSAPreCheckQuery, TSAPreCheckValues);
                const testCompletedResult = await client.query(testCompletedQuery, TSAPreCheckValues);

                if (TSAPreCheckResult.rows.length > 0 && testCompletedResult.rows[0].test_completed) {
                    res.status(200).send({ status: "Complete" });
                    return;
                } else if (TSAPreCheckResult.rows.length > 0 && !testCompletedResult.rows[0].test_completed) {
                    const studentIDQuery = `
                        SELECT student_id
                        FROM students
                        WHERE user_code = $1 AND email = $2 AND first_name = $3 AND last_name = $4;`;

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
                const pastCourses = req.body["past_courses"];
                const test_id = Math.max(...pastCourses.map(course => course.past_course_id));

                const insertQuery = `
                    INSERT INTO students (user_code, first_name, last_name, email, desired_class, test_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING student_id;`;

                const values = [
                    req.body["user_code"],
                    req.body["first_name"],
                    req.body["last_name"],
                    req.body["email"],
                    req.body["desired_class"],
                    test_id // Insert the highest past_course_id as test_id
                ];

                const result = await client.query(insertQuery, values);
                const studentId = result.rows[0].student_id;

                res.status(200).json({ status: "ok", student_id: studentId, test_id });
                // logger.info(`Student added with ID: ${studentId}`);
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
