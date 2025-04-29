const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/pastCourses", async (req, res) => {
    let client;
    try {
        client = await dbConn.connect();
        const query = `
                        SELECT  pc.past_course_id, pc.display_order, pc.description
                        FROM past_courses pc;
                    `;

        const result = await client.query(query);
        if (result.rows.length === 0) {
            throw new TypeError("Content is undefined");
        }
        res.send(result.rows);

    } catch (error) {
        logger.error(`Error: ${error}`);
        res.status(500).send({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
});

module.exports = router;