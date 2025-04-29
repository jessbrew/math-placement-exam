const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

// router.post("/questionaire", async (req, res) => {
//     // // Pass in
//     // {
//     //     "student_id":20,
//     //     "past_course_id": 4,
//     //     "desired_class":"math",
//     //     "in_math_last_year":"one of them",
//     // }

//     let result = [];
//     try {
//         if (req.body["student_id"] === undefined || req.body["student_id"] === null) {
//             res.status(400).send({ error: "Missing ID parameter" });
//         } else if (
//             req.body["past_course_id"] === undefined ||
//             req.body["past_course_id"] === null
//         ) {
//             res.status(400).send({ error: "Please include a valid course" });
//         } else if (
//             req.body["in_math_last_year"] === undefined ||
//             req.body["in_math_last_year"] === null
//         ) {
//             res.status(400).send({ error: "Missing parameter" });
//         } else {
//             dbConn.connect().then(async function () {
//                 try {
//                     const client = await dbConn.connect(); // Use the pg client
//                     const updateQuery = `
//                         UPDATE students
//                         SET in_math_last_year = $1
//                         WHERE student_id = $2
//                         `;
//                     const updateValues = [
//                         req.body["in_math_last_year"], // $1
//                         req.body["student_id"],        // $2
//                     ];
//                     await client.query(updateQuery, updateValues);

//                     const testQuery = `
//                         SELECT test_id 
//                         FROM past_courses pc 
//                         INNER JOIN tests t ON pc.test_type = t.test_name 
//                         WHERE past_course_id = $1;
//                     `;
//                     const testResult = await client.query(testQuery, [parseInt(req.body["past_course_id"], 10)]);

//                     if (testResult.rows.length === 0) {
//                         res.sendStatus(400);
//                     } else {
//                         const test_id = testResult.rows[0].test_id;

//                         const updateTestQuery = `
//                             UPDATE students 
//                             SET test_id = $1, start_time = NOW() 
//                             WHERE student_id = $2;
//                         `;
//                         await client.query(updateTestQuery, [parseInt(test_id, 10), parseInt(req.body["student_id"], 10)]);
//                     }

//                     if (testResult.rows.length === 0) {
//                         res.sendStatus(400);
//                     } else {
//                         const test_id = testResult.rows[0].test_id;
//                         result.push({ test_id });

//                         const questionQuery = `
//                             SELECT tq.question_id, q.question_text, a.answer_text, a.answer_id 
//                             FROM test_questions tq 
//                             INNER JOIN tests t ON t.test_id = tq.test_id 
//                             INNER JOIN questions q ON q.question_id = tq.question_id
//                             INNER JOIN answers a ON a.question_id = q.question_id 
//                             WHERE t.test_id = $1;
//                         `;
//                         const questionResult = await client.query(questionQuery, [test_id]);

//                         const questions = questionResult.rows;
//                         let questionIdKeys = new Set();
//                         let answerArray = [];
//                         let qId = 0;
//                         let qText = "";

//                         for (let i = 0; i < questions.length; ++i) {
//                             if (
//                                 questionIdKeys.has(questions[i]["question_id"]) &&
//                                 questionIdKeys.size !== 0 &&
//                                 i !== questions.length
//                             ) {
//                                 answerArray.push({
//                                     AnswerID: questions[i]["answer_id"],
//                                     AnswerText: questions[i]["answer_text"],
//                                 });
//                             } else if (
//                                 !questionIdKeys.has(questions[i]["question_id"]) &&
//                                 questionIdKeys.size !== 0
//                             ) {
//                                 let stage = {
//                                     question_id: qId,
//                                     question_text: qText,
//                                     answers: answerArray,
//                                 };
//                                 result.push(stage);
//                                 answerArray = [];
//                                 answerArray.push({
//                                     AnswerID: questions[i]["answer_id"],
//                                     AnswerText: questions[i]["answer_text"],
//                                 });
//                                 qId = questions[i]["question_id"];
//                                 qText = questions[i]["question_text"];
//                                 questionIdKeys.add(questions[i]["question_id"]);
//                             } else if (
//                                 !questionIdKeys.has(questions[i]["question_id"]) &&
//                                 questionIdKeys.size === 0
//                             ) {
//                                 qId = questions[i]["question_id"];
//                                 qText = questions[i]["question_text"];
//                                 answerArray.push({
//                                     AnswerID: questions[i]["answer_id"],
//                                     AnswerText: questions[i]["answer_text"],
//                                 });
//                                 questionIdKeys.add(questions[i]["question_id"]);
//                             }
//                             if (i === questions.length - 1) {
//                                 let stage = {
//                                     question_id: qId,
//                                     question_text: qText,
//                                     answers: answerArray,
//                                 };
//                                 result.push(stage);
//                             }
//                         }

//                         const updateTestQuery = `
//                             UPDATE students 
//                             SET test_id = $1, start_time = NOW() 
//                             WHERE student_id = $2;
//                         `;
//                         await client.query(updateTestQuery, [test_id, req.body["student_id"]]);

//                         res.send(result);
//                     }
//                     client.release(); // Release the client back to the pool
//                 } catch (err) {
//                     console.error(`Error: ${err}`);
//                     res.status(500).send({ error: "Internal Server Error" });
//                 }
//             });
//         }
//     } catch (err) {
//         console.log(`Error: ${err}`);
//     }
// });
// module.exports = router;