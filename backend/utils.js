//////////////////////////////
// Student utility functions
//////////////////////////////
async function hasCompletedTest(client, userCode) {
    const testCompletedQuery = `
        SELECT test_completed
        FROM students
        WHERE user_code = $1;`;

    const testCompletedResult = await client.query(testCompletedQuery, [userCode]);
    return testCompletedResult.rows.length > 0 && testCompletedResult.rows[0].test_completed;
}

async function removePartialTest(client, userCode) {
    const testCompletedQuery = `
        SELECT test_completed, student_id
        FROM students
        WHERE user_code = $1;`;

    const testCompletedResult = await client.query(testCompletedQuery, [userCode]);

    // no need to remove anything if student didn't take the test or if it's completed
    if (
        testCompletedResult.rows.length === 0 ||
        (testCompletedResult.rows.length > 0 && testCompletedResult.rows[0].test_completed)
    ) {
        return;
    }

    const studentId = testCompletedResult.rows[0].student_id;
    await client.query(
        `DELETE FROM student_past_courses
                        WHERE student_id = $1;`,
        [studentId]
    );
    await client.query(
        `DELETE FROM student_answers
                        WHERE student_id = $1;`,
        [studentId]
    );
    await client.query(
        `DELETE FROM students
                        WHERE student_id = $1;`,
        [studentId]
    );
    logger.info(`Deleted student with ID: ${studentId}`);
}

async function getTestFromCourse(client, courseId) {
    const findTestQuery = `
        SELECT test_id
        FROM available_course
        WHERE available_course_id = $1
    `;
    const testInfo = await client.query(findTestQuery, [courseId]);
    return testInfo.rows[0].test_id;
}

module.exports = { hasCompletedTest, removePartialTest, getTestFromCourse };
