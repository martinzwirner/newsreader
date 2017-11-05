"use strict";

const winston = require('winston');

const logger = winston;

logger.configure({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/newsreader.log' })
  ]
});

module.exports = logger;