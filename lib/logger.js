"use strict";

const winston = require('winston');
const config = winston.config;

const logger = winston;

logger.configure({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      timestamp: function() {
        return Date.now();
      },
      formatter: function(options) {
        // - Return string will be passed to logger.
        // - Optionally, use options.colorize(options.level, <string>) to
        //   colorize output based on the log level.
        return options.timestamp() + ' ' +
          //config.colorize(options.level, options.level.toUpperCase()) + ' ' +
          options.level.toUpperCase() + ' ' +
          (options.meta ? options.meta.source + ': ' : '') +
          (options.message ? options.message : '');
          //(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    }),
    new winston.transports.File({ filename: './logs/newsreader.log' })
  ]
});

module.exports = logger;