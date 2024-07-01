const express = require("express");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();


router.post("/datacheck/all", async (req, res) => {
    // console.log('hello 1');

    dbConn.connect().then( async client => {
        const polled = await client.query('SELECT * FROM questions')
        res.status(200).send(polled)
    });

    let result = [];
//     dbConn.connect().then(client => {
//         console.log('hello 2');
//         // client.release()
//         // var request = new sql.Request(dbConn);
//         client.query(
//             "SELECT q.question_id, q.question_text, qt.type_title, qs.status, qs.description, a.answer_id, a.answer_text,a.is_correct FROM questions q INNER JOIN question_status qs ON q.question_id = qs.question_id INNER JOIN question_types qt ON q.question_type = qt.question_type_id INNER JOIN answers a ON q.question_id = a.question_id;",
//             function (err, data) {
//                 let entries = data.recordset;
//                 let test = Array.from(entries);
//                 let seen = [];
//                 let resultarr = [];
//                 let prev;
//                 let tmp = [];
//                 let answers = [];
//                 let answerTmp = {};

//                 for (i = 0; i < test.length; i++) {
//                     if (test[i]["question_id"] === 1 && test[i]["answer_id"] === 1) {
//                         seen.push(test[i]["question_id"]);
//                         answerTmp = {
//                             answer_id: test[i]["answer_id"],
//                             answer_text: test[i]["answer_text"],
//                             is_correct: test[i]["is_correct"],
//                         };
//                         answers.push(answerTmp);
//                         answerTmp = {};
//                         prev = test[i]["question_id"];
//                     } else if (seen.includes(test[i]["question_id"])) {
//                         if (prev != test[i]["question_id"]) {
//                             prev = test[i]["question_id"];
//                             answerTmp = {
//                                 answer_id: test[i]["answer_id"],
//                                 answer_text: test[i]["answer_text"],
//                                 is_correct: test[i]["is_correct"],
//                             };
//                             answers.push(answerTmp);
//                             answerTmp = {};
//                             let obj = {
//                                 question_id: test[i - 1]["question_id"],
//                                 question_text: test[i - 1]["question_text"],
//                                 type_title: test[i - 1]["type_title"],
//                                 status: test[i]["status"],
//                                 description: test[i - 1]["description"],
//                                 answer: answers,
//                             };
//                             resultarr.push(obj);
//                             tmp = [];
//                         } else if (i == test.length - 1) {
//                             answerTmp = {
//                                 answer_id: test[i]["answer_id"],
//                                 answer_text: test[i]["answer_text"],
//                                 is_correct: test[i]["is_correct"],
//                             };
//                             answers.push(answerTmp);
//                             answerTmp = {};

//                             let obj = {
//                                 question_id: test[i - 1]["question_id"],
//                                 question_text: test[i - 1]["question_text"],
//                                 type_title: test[i - 1]["type_title"],
//                                 status: test[i - 1]["status"],
//                                 description: test[i - 1]["description"],
//                                 answer: answers,
//                             };
//                             resultarr.push(obj);
//                         } else {
//                             answerTmp = {
//                                 answer_id: test[i]["answer_id"],
//                                 answer_text: test[i]["answer_text"],
//                                 is_correct: test[i]["is_correct"],
//                             };
//                             answers.push(answerTmp);
//                             answerTmp = {};

//                             prev = test[i]["question_id"];
//                         }
//                     } else if (!seen.includes(test[i]["question_id"])) {
//                         answerTmp = {};
//                         seen.push(test[i]["question_id"]);
//                         let obj = {
//                             question_id: test[i - 1]["question_id"],
//                             question_text: test[i - 1]["question_text"],
//                             type_title: test[i - 1]["type_title"],
//                             status: test[i - 1]["status"],
//                             description: test[i - 1]["description"],
//                             answer: answers,
//                         };
//                         resultarr.push(obj);
//                         answers = [];
//                         tmp = [];

//                         prev = test[i]["question_id"];
//                         tmp.push(test[i]["answer_id"]);
//                         answerTmp = {
//                             answer_id: test[i]["answer_id"],
//                             answer_text: test[i]["answer_text"],
//                             is_correct: test[i]["is_correct"],
//                         };
//                         answers.push(answerTmp);
//                         answerTmp = {};
//                     }
//                 }
//                 logger.info("Successfully pulled datacheck/all");
//                 res.send(resultarr);
//             }
//         ).then();


//     });
// });

// router.post("/datacheck/update", async (req, res) => {
//     // Sample of how to send
//     //{
//     //     "question_id":1,
//     //     "status":1,
//     //     "description":"This is a test"
//     // }
//     let result = [];
//     console.log(req.body["question_id"]);
//     dbConn.connect().then(async function () {
//         var request = new sql.Request(dbConn);
//         request.query(
//             `UPDATE question_status SET status = ${req.body["status"]}, description = '${req.body["description"]}' WHERE question_id = ${req.body["question_id"]}; SELECT * FROM question_status WHERE question_id = ${req.body["question_id"]};`,
//             function (err, data) {
//                 console.log(data);
//                 let entries = data.recordset;
//                 let test = Array.from(entries);
//                 for (i = 0; i < test.length; i++) {
//                     result.push(test[i]);
//                 }
//                 res.send(result);
//             }
//         );
//     });
});

module.exports = router;
