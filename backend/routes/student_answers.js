const express = require("express");
const sql = require("mssql");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/studentanswers/all", async (req, res) => {
    let result = [];
    dbConn.connect().then(async function () {
        logger.info("connected to db at /studentanswers/all");
        var request = new sql.Request(dbConn);
        request.query("select * from student_answers", function (err, data) {
            let entries = data.recordset;
            let test = Array.from(entries);
            for (i = 0; i < test.length; i++) {
                result.push(test[i]);
            }
            logger.info("Data pulled from /studentanswers/all");
            res.send(result);
        });
    });
});

module.exports = router;
