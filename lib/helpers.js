"use strict";

const fs = require('fs');

const logger = require('./logger');

class helpers {

  constructor() {

    this._loggingContext = {
      source: "helpers"
    };
  }

  writeFile(filepath, content) {

    return new Promise((resolve, reject) => {

      fs.writeFile(filepath, content, (err) => {

        if (err) {

          logger.error('writeFile: error writing ' + filepath + ': ' + err.message + '\n' + err.stack, this._loggingContext);
          reject(err);
        }

        logger.debug('writeFile: wrote ' + filepath, this._loggingContext);
        resolve();
      });
    });
  }
}

module.exports = helpers;