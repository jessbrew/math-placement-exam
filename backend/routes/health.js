const express = require('express');
const router = express.Router();
const dbConn = require('../dbconnection.js');
const logger = require('../logger.js');

/**
 * @openapi
 * /health:
 *  get:
 *      summary: Verify API health
 *      tags:
 *          - health
 *      responses:
 *          200:
 *              description: This is your daily health check
 */
router.get('/', (req, res) => {
    logger.info('Test debug');
    res.send('This is your daily health check');
});

/**
 * @openapi
 * /health/db:
 *  get:
 *      summary: Verify database connection is valid
 *      tags:
 *          - health
 *      responses:
 *          200:
 *              description: Dratabase Connection Established
 *          500:
 *              description: Database Connection Failed
 */
router.get('/db', async (req, res) => {
    logger.info('Test Connection to Database');
    let client;
    try {
        logger.info('connected to db at /testConnection');
        client = await dbConn.connect(); // Use the pg client

        logger.info('Attempt to query the database');
        await client.query('SELECT * from tests');

        res.status(200).json({ status: 'ok', message: 'Database Connection Established' });
    } catch (error) {
        logger.error('Database Connection Failed', error);
        res.status(500).json({ status: 'error', message: 'Database Connection Failed' });
    } finally {
        if (client) {
            client.release();
        }
    }
});

module.exports = router;
