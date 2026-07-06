const express = require('express');
const dbConn = require('../dbconnection.js');
const logger = require('../logger.js');
const router = express.Router();

const { hasCompletedTest, removePartialTest, getTestFromCourse } = require('../utils');

/**
 * @openapi
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags:
 *       - students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_code
 *               - first_name
 *               - last_name
 *               - email
 *               - past_courses
 *               - available_course_id
 *             properties:
 *               user_code:
 *                 type: integer
 *                 example: 1234567
 *               first_name:
 *                 type: string
 *                 example: Bob
 *               last_name:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: bob.smith@mail.wlc.edu
 *               past_courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - past_course_id
 *                   properties:
 *                     past_course_id:
 *                       type: integer
 *                       example: 1
 *               available_course_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Test status response
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Test session ready
 *                   required:
 *                     - status
 *                     - student_id
 *                     - test_id
 *                     - time_limit
 *                     - question_count
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     student_id:
 *                       type: integer
 *                       example: 123
 *                     test_id:
 *                       type: integer
 *                       example: 1
 *                     time_limit:
 *                       type: integer
 *                       example: 60
 *                     question_count:
 *                       type: integer
 *                       example: 40
 *
 *                 - type: object
 *                   description: Test already completed
 *                   required:
 *                     - status
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: Complete
 *
 *       400:
 *         description: Missing required parameter
 *       500:
 *         description: Internal Server Error
 */
router.post('/', async (req, res) => {
    // verify required fields are included
    const requiredFields = [
        'user_code',
        'first_name',
        'last_name',
        'email',
        'past_courses',
        'available_course_id',
    ];
    const missingField = requiredFields.find((field) => req.body[field] == null);
    if (missingField) {
        return res.status(400).json({
            error: `Missing ${missingField} parameter`,
        });
    }

    if (!Array.isArray(req.body.past_courses) || req.body.past_courses.length === 0) {
        return res.status(400).json({
            error: 'past_courses must be an array with at least one element',
        });
    }

    let client;

    try {
        client = await dbConn.connect();
        const { user_code, first_name, last_name, email, past_courses, available_course_id } =
            req.body;

        // student already completed the test
        if (await hasCompletedTest(client, user_code)) {
            return res.status(200).json({ status: 'Complete' });
        }

        // make sure all inserts are successful
        await client.query('BEGIN');
        try {
            // student may have started the test but never finished - delete the old
            // information and let them start over
            await removePartialTest(client, user_code);

            // create the student record
            const testId = await getTestFromCourse(client, available_course_id);
            const insertQuery = `
                    INSERT INTO students (user_code, first_name, last_name, email, available_course_id, test_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING student_id;`;
            const values = [user_code, first_name, last_name, email, available_course_id, testId];
            const result = await client.query(insertQuery, values);
            const studentId = result.rows[0].student_id;

            // Insert past courses
            const vals = past_courses.flatMap((course) => [studentId, course.past_course_id]);
            const placeholders = past_courses
                .map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
                .join(', ');
            const query = `INSERT INTO student_past_courses (student_id, past_course_id) VALUES ${placeholders}`;
            await client.query(query, vals);
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }

        // Get the amount of time and question count
        const testQuery = `
                    SELECT time_limit, (SELECT COUNT(*) FROM test_questions WHERE test_id = $1) AS "question_count"
                    FROM tests
                    WHERE test_id = $1`;

        const testResult = await client.query(testQuery, [testId]);
        res.status(200).json({
            status: 'ok',
            student_id: studentId,
            test_id: testId,
            time_limit: testResult.rows[0].time_limit,
            question_count: testResult.rows[0].question_count,
        });
        logger.info(`Student added with ID: ${studentId}`);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client?.release();
    }
});

module.exports = router;
