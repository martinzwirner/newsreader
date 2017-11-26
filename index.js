"use strict";

const main = require('./lib/main');
const config = require('./config.json');
const logger = require('./lib/logger');

process.on('uncaughtException', function(err){
  logger.error("Unhandled Exception: " + err.message + '\n' + err.stack);
});

process.on('unhandledRejection', function(reason, p){
  logger.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

new main(config);
