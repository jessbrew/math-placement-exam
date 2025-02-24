const express = require("express");
const sql = require("pg");
const dbConn = require("../dbconnection.js");
const logger = require("../logger.js");
const router = express.Router();

router.post("/questionaire", async (req, res) => {
    // // Pass in
    // {
    //     "student_id":20,
    //     "past_course_id": 4,
    //     "most_advanced_class_taken":"a",
    //     "most_advanced_class_grade":"b",
    //     "desired_class":"math",
    //     "math_in_last_year":"one of them",
    //     "advisor":"Dr. so and so"
    // }

    let result = [];
    try {
        if (req.body["student_id"] === undefined || req.body["student_id"] === null) {
            res.status(400).send({ error: "Missing ID parameter" });
        } else if (
            req.body["past_course_id"] === undefined ||
            req.body["past_course_id"] === null
        ) {
            res.status(400).send({ error: "Please include a valid course" });
        } else if (
            req.body["most_advanced_class_taken"] === undefined ||
            req.body["most_advanced_class_taken"] === null
        ) {
            res.status(400).send({ error: "Please include a valid course" });
        } else if (
            req.body["most_advanced_class_grade"] === undefined ||
            req.body["most_advanced_class_grade"] === null
        ) {
            res.status(400).send({ error: "Missing parameter" });
        } else if (req.body["desired_class"] === undefined || req.body["desired_class"] === null) {
            res.status(400).send({ error: "Missing parameter" });
        } else if (
            req.body["math_in_last_year"] === undefined ||
            req.body["math_in_last_year"] === null
        ) {
            res.status(400).send({ error: "Missing parameter" });
        } else if (req.body["advisor"] === undefined || req.body["advisor"] === null) {
            res.status(400).send({ error: "Missing parameter" });
        } else {
            dbConn.connect().then(async function () {
                var request = new sql.Request(dbConn);
                request.query(
                    `UPDATE students 
                SET advisor = '${req.body["advisor"]}', most_advanced_class_taken = '${req.body["most_advanced_class_taken"]}', 
                most_advanced_class_grade = '${req.body["most_advanced_class_grade"]}', 
                desired_class ='${req.body["desired_class"]}', math_in_last_year = '${req.body["math_in_last_year"]}'
                WHERE student_id = '${req.body["student_id"]}';

                SELECT test_id FROM past_courses pc 
                INNER JOIN tests t ON pc.test_type = t.test_name 
                WHERE past_course_id = ${req.body["past_course_id"]}`,
                    function (err, data) {
                        if (data === undefined) {
                            throw TypeError("Content is undefined");
                        }
                        let test = data.recordset;
                        test = Array.from(test);
                        if (test[0] == undefined) {
                            res.sendStatus(400);
                        } else {
                            let test_id = test[0]["test_id"];
                            result.push({ test_id: test_id });
                            request.query(
                                `SELECT tq.question_id, q.question_text, a.answer_text, a.answer_id 
                        FROM test_questions tq 
                        INNER JOIN tests t ON t.test_id = tq.test_id 
                        INNER JOIN questions q ON q.question_id = tq.question_id
                        INNER JOIN answers a ON a.question_id = q.question_id 
                        WHERE t.test_id = ${test_id};

                        UPDATE students 
                        SET test_id = ${test_id}
                        WHERE student_id = '${req.body["student_id"]}';`,
                                function (err, data) {
                                    let q = data.recordset;
                                    let questions = Array.from(q);
                                    let questionIdKeys = new Set();
                                    let answerArray = [];
                                    let qId = 0;
                                    let qText = "";
                                    for (i = 0; i < questions.length; ++i) {
                                        if (
                                            questionIdKeys.has(questions[i]["question_id"]) &&
                                            questionIdKeys.size != 0 &&
                                            i != questions.size
                                        ) {
                                            answerArray.push(
                                                `{AnswerID:${questions[i]["answer_id"]}}, {AnswerText:${questions[i]["answer_text"]}}`
                                            );
                                        } else if (
                                            !questionIdKeys.has(questions[i]["question_id"]) &&
                                            questionIdKeys.size != 0
                                        ) {
                                            let stage = {
                                                question_id: qId,
                                                question_text: qText,
                                                answers: answerArray,
                                            };
                                            result.push(stage);
                                            answerArray = [];
                                            answerArray.push(
                                                `{AnswerID:${questions[i]["answer_id"]}}, {AnswerText:${questions[i]["answer_text"]}}`
                                            );
                                            qId = questions[i]["question_id"];
                                            qText = questions[i]["question_text"];
                                            questionIdKeys.add(questions[i]["question_id"]);
                                        } else if (
                                            !questionIdKeys.has(questions[i]["question_id"]) &&
                                            questionIdKeys.size == 0
                                        ) {
                                            qId = questions[i]["question_id"];
                                            qText = questions[i]["question_text"];
                                            answerArray.push(
                                                `{AnswerID:${questions[i]["answer_id"]}}, {AnswerText:${questions[i]["answer_text"]}}`
                                            );
                                            questionIdKeys.add(questions[i]["question_id"]);
                                        } else if (
                                            questions[i]["question_id"] &&
                                            questionIdKeys.size != 0
                                        ) {
                                            let stage = {
                                                question_id: qId,
                                                question_text: qText,
                                                answers: answerArray,
                                            };
                                            result.push(stage);
                                        } else {
                                            answerArray.push(
                                                `{AnswerID:${questions[i]["answer_id"]}}, {AnswerText:${questions[i]["answer_text"]}}`
                                            );
                                        }
                                        if (i == questions.length - 1) {
                                            let stage = {
                                                question_id: qId,
                                                question_text: qText,
                                                answers: answerArray,
                                            };
                                            result.push(stage);
                                        }
                                    }
                                    request.query(
                                        `UPDATE students SET start_time = GETDATE() WHERE student_id = '${req.body["student_id"]}';`
                                    );
                                    res.send(result);
                                }
                            );
                        }
                    }
                );
            });
        }
    } catch (err) {
        console.log(`Error: ${err}`);
    }
});
module.exports = router;
