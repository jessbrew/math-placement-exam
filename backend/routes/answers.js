const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();


router.post("/submit_answer", async (req, res) => {
    try {
        dbConn.connect().then( async client => {
            const result = await client.query('SELECT * FROM tests')
            res.status(200).send(result.rows)
        });
    } catch {}
});
    
module.exports = router;
