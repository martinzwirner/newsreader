"use strict";

const winston = require('winston');
const dailyRotateFile = require('winston-daily-rotate-file');
const config = winston.config;

const logger = winston;

logger.configure({
  transports: [
    new winston.transports.Console({
      level: 'info',
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
    new dailyRotateFile({
      filename: './logs/newsreader-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '1m',
      maxFiles: '7d'
    })
  ]
});

module.exports = logger;