const express = require("express");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/submit_answer", async (req, res) => {
    let client;
    try {
        client = await dbConn.connect(); // Get a client from the pool
        logger.info("connected to db at /submit_answer");
        const result = await client.query("SELECT * FROM tests");
        res.status(200).send(result.rows);
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(500).send({ error: "Internal Server Error" });
    } finally {
        if (client) {
            client.release(); // Make sure to release the client back to the pool
        }
    }
});

module.exports = router;