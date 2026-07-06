const express = require('express');
const dbConn = require('../dbconnection.js');
const logger = require('../logger.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateAdmin } = require('../utils.js');

/**
 * @openapi
 * /admin/login:
 *   post:
 *     summary: Authenticate admin user
 *     tags:
 *       - admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin_user
 *               password:
 *                 type: string
 *                 format: password
 *                 example: super_secret_password_123
 *     responses:
 *       200:
 *         description: Authentication successful. Returns a JSON Web Token (JWT).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized. Invalid username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        // Generate a token that expires in 2 hours
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/test', authenticateAdmin, async (req, res) => {
    return res.status(200).json({ msg: 'yay!' });
});

module.exports = router;
