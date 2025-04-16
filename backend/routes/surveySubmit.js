const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/surveySubmit", async (req, res) => {
    // Request
    // { "user_code": 1234567,
    //  "f_name": "bob",
    //  "l_name": "smith",
    //  "email": "bob.smith@mail.wlc.edu",
    //  "past_courses": [
    //  {"past_course_id": 1},
    //  {"past_course_id": 2}
    //  ],
    //  "desired_class": "Calc 3",
    //  "advisor" : "So and So" }
    try {
        if (req.body["user_code"] === undefined || req.body["user_code"] === null) {
            res.status(400).send({ error: "Missing student_code parameter" });
        } else if (req.body["f_name"] === undefined || req.body["f_name"] === null) {
            res.status(400).send({ error: "Missing f_name parameter" });
        } else if (req.body["l_name"] === undefined || req.body["l_name"] === null) {
            res.status(400).send({ error: "Missing l_name parameter" });
        } else if (req.body["email"] === undefined || req.body["email"] === null) {
            res.status(400).send({ error: "Missing email parameter" });
        } else if (req.body["past_courses"] === undefined || req.body["past_courses"] === null) {
            res.status(400).send({ error: "Missing past_courses parameter" });
        } else if (req.body["desired_class"] === undefined || req.body["desired_class"] === null) {
            res.status(400).send({ error: "Missing desired_class parameter" });
        } else if (req.body["advisor"] === undefined || req.body["advisor"] === null) {
            res.status(400).send({ error: "Missing advisor parameter" });
        }
        else {
            dbConn.connect().then(async function () {

                try {

                    const client = await dbConn.connect(); // Use the pg client
                    logger.info("connected to db at /submit");
                    const pastCourses = req.body["past_courses"];
                    const highestPastCourseId = Math.max(...pastCourses.map(course => course.past_course_id));

                    const insertQuery = `
                    INSERT INTO students (user_code, f_name, l_name, email, desired_class, advisor, test_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING student_id;`;

                    const values = [
                        req.body["user_code"],
                        req.body["f_name"],
                        req.body["l_name"],
                        req.body["email"],
                        req.body["desired_class"],
                        req.body["advisor"],
                        highestPastCourseId // Insert the highest past_course_id as test_id
                    ];

                    const result = await client.query(insertQuery, values);
                    const studentId = result.rows[0].student_id;

                    res.status(200).json({ status: "ok", student_id: studentId, highestPastCourseId });
                    logger.info(`Student added with ID: ${studentId}`);

                }
                catch (err) {
                    logger.error(`Error: ${err}`);
                    res.status(500).send({ error: "Internal Server Error" });
                }

            });
        }
    }
    catch (err) {
        logger.error(`Error: ${err}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;
