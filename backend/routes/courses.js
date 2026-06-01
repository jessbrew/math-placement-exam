const express = require('express');
const sql = require('pg');
const dbConn = require('../dbconnection.js');
const logger = require('../logger.js');
const router = express.Router();

/**
 * @openapi
 * /courses/available:
 *  get:
 *      summary: Get available courses
 *      tags:
 *          - courses
 *      responses:
 *          200:
 *              description: List of courses
 *          500:
 *              description: Internal Server Error
 */

router.get('/available', async (req, res) => {
    let client;
    try {
        client = await dbConn.connect();
        const query = `
                        SELECT  available_course_id, display_order, description
                        FROM available_course ;
                    `;

        const result = await client.query(query);
        if (result.rows.length === 0) {
            throw new TypeError('Content is undefined');
        }
        res.send(result.rows);
    } catch (error) {
        logger.error(`Error: ${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

/**
 * @openapi
 * /courses/past:
 *  get:
 *      summary: Get past course options
 *      tags:
 *          - courses
 *      responses:
 *          200:
 *              description: List of past courses
 *          500:
 *              description: Internal Server Error
 */

router.get('/past', async (req, res) => {
    let client;
    try {
        client = await dbConn.connect();
        const query = `
                        SELECT  pc.past_course_id, pc.display_order, pc.description
                        FROM past_courses pc;
                    `;

        const result = await client.query(query);
        if (result.rows.length === 0) {
            throw new TypeError('Content is undefined');
        }
        res.send(result.rows);
    } catch (error) {
        logger.error(`Error: ${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

module.exports = router;
