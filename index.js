"use strict";

const main = require('./lib/main');
const config = require('./config.json');
const logger = require('./lib/logger');

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  logger.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

new main(config);
