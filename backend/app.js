const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
// TODO: update all routes to modern routing
app.use('/health', require('./routes/health'));
app.use('/courses', require('./routes/courses'));
app.use('/students', require('./routes/students'));

// OLD
app.use('/', (submit = require('./routes/surveySubmit.js')));
app.use('/', (start = require('./routes/startTest.js')));
app.use('/', (submitAnswer = require('./routes/submitAnswer.js')));
app.use('/', (complete = require('./routes/testComplete.js')));

module.exports = app;
