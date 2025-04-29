const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

// router.post("/students/login", async (req, res) => {
//     // {
//     // "warrior_id": 1234321,
//     // "first_name": "Jimmy",
//     // "last_name": "Dean"
//     // }
//     try {
//         if (req.body["student_id"] === undefined || req.body["student_id"] === null) {
//             res.status(400).send({ error: "Missing ID parameter" });
//         }
//         //  else if (req.body["first_name"] === undefined || req.body["first_name"] === null) {
//         //     res.status(400).send({ error: "Missing First name parameter" });
//         // } else if (req.body["last_name"] === undefined || req.body["last_name"] === null) {
//         //     res.status(400).send({ error: "Missing Last name parameter" });
//         // }
//         else {
//             let result = [];
//             dbConn.connect().then(async function () {
//                 try {
//                     const client = await dbConn.connect(); // Use the pg client
//                     logger.info("connected to db at /students/login");

//                     // Check if the student already exists
//                     const selectQuery = `SELECT * FROM students WHERE student_id = $1`;
//                     const selectResult = await client.query(selectQuery, [req.body["student_id"]]);

//                     // INSERT INTO students(student_id, first_name, last_name) 
//                     // VALUES($1, $2, $3) 
//                     if (selectResult.rows.length === 0) {
//                         // Insert new student if not found
//                         const insertQuery = `
//                             INSERT INTO students(student_id)
//                                 VALUES($1)
//                             RETURNING *;
//                         `;
//                         const insertResult = await client.query(insertQuery, [
//                             req.body["student_id"],
//                             // req.body["first_name"],
//                             // req.body["last_name"],
//                         ]);

//                         const newStudent = insertResult.rows[0];
//                         const retObj = {
//                             new: true,
//                             student_id: newStudent.student_id,
//                             question_id: null,
//                             test_id: null,
//                             completed: false,
//                             test_started_on: null,
//                             updated_on: null,
//                         };
//                         res.status(200).send(retObj);
//                         logger.info("Inserted student");
//                     } else {
//                         // Student already exists
//                         const existingStudent = selectResult.rows[0];
//                         const retObj = {
//                             new: false,
//                             student_id: existingStudent.student_id,
//                             question_id: null,
//                             test_id: null,
//                             completed: false,
//                             test_started_on: null,
//                             updated_on: null,
//                         };
//                         res.status(200).send(retObj);
//                         logger.info({ result: selectResult.rows });
//                     }

//                     client.release(); // Release the client back to the pool
//                 } catch (err) {
//                     logger.error(`Error: ${err}`);
//                     res.status(500).send({ error: "Internal Server Error" });
//                 }
//             });
//         }
//     } catch (err) {
//         logger.error(`Error: ${err}`);
//         res.status(500).send({ error: "Internal Server Error" });
//     }
// });

// module.exports = router;