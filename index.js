"use strict";

const process = require('process');
const processor = require('./lib/processing/processor');
const logger = require('./lib/logger');
const Http = require('./lib/http');
const importer = require('./lib/import/importer');
const Database = require('./lib/database');
const PocketHtmlExport = require('./lib/import/pocket/HtmlExport');

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  logger.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

Database.connect()
.then(() => {

  logger.debug('db connection established');

  importer.import(PocketHtmlExport)
  .then(() => {
    logger.debug('import done');
    processor.startAsync();
  });

  logger.debug('import started');

  new Http({port: 8080});
});
