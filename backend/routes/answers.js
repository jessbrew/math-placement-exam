const express = require("express");
const sql = require("mssql");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/answers", async (req, res) => {
    try {
        res.sendStatus(200);
        logger._flush;
    } catch {
        logger.error("Could not get the answers endpoint");
    }
});
router.post("/answers/topten", async (req, res) => {
    let result = [];
    dbConn.connect().then(async function () {
        var request = new sql.Request(dbConn);
        request.query("select top 10 * from answers", function (err, data) {
            let entries = data.recordset;
            let test = Array.from(entries);
            for (i = 0; i < test.length; i++) {
                result.push(test[i]);
            }
            logger.info("Pulled topten from answers");
            res.send(result);
        });
    });
});

module.exports = router;
