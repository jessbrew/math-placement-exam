const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

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
            const updateQuery = `
                    UPDATE students
                    SET test_completed = true
                    WHERE student_id = $1;
                `;
            await client.query(updateQuery, [req.body["student_id"]]);
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

module.exports = router;