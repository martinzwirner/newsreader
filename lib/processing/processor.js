"use strict";

const fs = require("fs");

const rimraf = require('rimraf-promise');

const logger = require('./../logger');
const UrlProcessor = require('./urlProcessor');

class processor {

  constructor(config, factory) {

    this._loggingContext = {
      source: "processor"
    };
    this._config = config;
    this._factory = factory;

    this._database = this._factory.getInstance('database');

    this._isRunning = false;

    if (this._config.cleanOnStart) {

      const promises = [];

      promises.push(rimraf(this._config.contentPath));
      promises.push(rimraf(this._config.textContentPath));

      Promise.all(promises)
      .then(() => {
        fs.mkdir(this._config.contentPath);
        fs.mkdir(this._config.textContentPath);
      })
      .catch((err) => {
        logger.error('constructor: error on cleaning: ' + err.message + '\n' + err.stack, this._loggingContext);
      });
    }
  }

  startAsync() {

    if (this._isRunning) {

      //logger.debug('startAsync: already running', this._loggingContext);
      return;
    }

    logger.info('startAsync: starting', this._loggingContext);
    this._isRunning = true;

    setTimeout(this._processNext.bind(this), 0);
  }

  _processNext() {

    logger.info('_processNext: processing next bookmark', this._loggingContext);

    this._database.getTable('bookmark').count({where: { isProcessed: false }})
    .then((count) => {
      logger.info('_processNext: ' + count + ' to go', this._loggingContext);
    });

    this._database.getTable('bookmark').findOne({where: { isProcessed: false },
      order: ['createdAt']
    }).then((bookmark) => {

      if (bookmark == null) {

        logger.info('nothing to process', this._loggingContext);
        this._isRunning = false;
        return;
      }

      logger.debug('oldest bookmark: ' + JSON.stringify(bookmark), this._loggingContext);
      return new UrlProcessor(this._config, this._factory, bookmark).start();
    })
    .then(() => {

      logger.info('processing done', this._loggingContext);

      if (this._isRunning) {

        this._processNext();
      }
    })
    .catch((err) => {

      logger.error('error in _processNext: ' + err.message + '\n' + err.stack, this._loggingContext);
    });
  }
}

module.exports = processor;