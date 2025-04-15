const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/pastCourses", async (req, res) => {
    try {
        dbConn.connect().then(async function () {
            try {
                const client = await dbConn.connect(); // Use the pg client
                logger.info("connected to db at /pastCourses");

                const query = `
                        SELECT  pc.past_course_id, pc.display_order, pc.description
                        FROM past_courses pc
                    `;

                const result = await client.query(query);

                if (result.rows.length === 0) {
                    throw new TypeError("Content is undefined");
                }

                res.send(result.rows)
                logger.info("Past courses returned");
                client.release(); // Release the client back to the pool


            } catch (err) {
                logger.error(`Error: ${err}`);
                res.status(500).send({ error: "Internal Server Error" });
            }
        });
    }
    catch (err) {
        logger.error(`Error: ${err}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
})

module.exports = router;