const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();
const {Resend} = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/testComplete", async (req, res) => {
    let client;
    try {
        // { "student_id": 2,  "status": "complete" }
        if (req.body["student_id"] === undefined || req.body["student_id"] === null) {
            res.status(400).send({ status: "error", error: "Missing student_id parameter" });
        } else if (req.body["status"] === undefined || req.body["status"] !== "complete") {
            res.status(400).send({ status: "error", error: "Invalid or missing status parameter" });
        }
        try {
            client = await dbConn.connect(); // Use the pg client
            const student_id = req.body["student_id"]
            const updateQuery = `
                    UPDATE students
                    SET test_completed = true
                    WHERE student_id = $1;
                `;
            await client.query(updateQuery, [student_id]);

            const studentNameQuery = `
                SELECT first_name || ' ' || last_name AS "name"
                FROM students
                WHERE student_id = $1
                `;
            const student_name = await client.query(studentNameQuery, [student_id]);

            // Send notification email the test is finished
            await sendEmail(student_name.rows[0].name);

            res.status(200).send({ status: "ok" });
        } catch (err) {
            logger.error("Error updating test completion: ", err);
            res.status(500).send({ status: "error", error: "Internal server error" });
        }


    } catch (err) {
        logger.error("Error in testComplete route: ", err);
        res.status(500).send({ status: "error", error: "Internal server error" });
    } finally {
        client.release();
    }
});

const sendEmail = async(student_name) => {
    const {data, error} = await resend.emails.send({
        from: 'Math Placement Exam <test@mathplacementexams.com>',
        to: process.env.RESULT_EMAILS.split(','),
        subject: 'Math Placement Exam Taken',
        html: `The Math Placement Exam has been completed by <b>${student_name}</b>. You can verify the results <a href="mathplacementexams.com/#/admin">here</a>.`,
    });
    
    if (error) {
        logger.error({ error });
        throw new Error("Failed to send email");
    }
}

module.exports = router;