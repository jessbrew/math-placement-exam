const express = require("express");
const router = express.Router();
const logger = require("../logger.js");
const dbConn = require("../dbconnection.js");

router.post("/testConnection", async (req, res) => {
    logger.info("Test Connection to Server");
    let client;
    try {
        logger.info("connected to db at /testConnection");
        client = await dbConn.connect(); // Use the pg client

        logger.info("Attempt to query the database");
        await client.query("SELECT * from tests");

        res.status(200).json({ status: "ok", message: "Database Connection Established" });
    } catch (error) {
        logger.error("Database Connection Failed", error);
        res.status(500).json({ status: "error", message: "Database Connection Failed" });
    } finally {
        client.release();
    }

});
module.exports = router;