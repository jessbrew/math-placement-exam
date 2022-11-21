const express = require("express")
const dotenv = require('dotenv')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const winston = require('winston')
const { combine, timestamp, json } = winston.format;
const app = require('../backend/server')

//Logging config
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({
            filename: 'logger.log',
        }),
    ],
});

//Specifying ports
PORT = 3000
app.listen((PORT), () => {
    logger.info("Server is running on port:" + PORT)
})
