"use strict";

const request = require('request-promise');

const Response = require('../businessObjects/Response');
const logger = require('../logger');

module.exports = class requestManager {

  constructor(config, factory) {

    this._loggingContext = {
      source: "requestManager"
    };

    this._config = config;
    this._factory = factory;
  }

  request(url) {

    // TODO identify tweets

    const result = new Response();

    return request.get({
      url: url,
      timeout: this._config.requestTimeout,
      resolveWithFullResponse: true, // we need headers
      encoding: null, // handle binary data correctly
      followRedirect: (response) => {

        this._urlAfterRedirect = response.headers.location;
        logger.debug('_loadContent: redirect to ', this._urlAfterRedirect, this._loggingContext);
        return true;
      }
    })
      .then((response) => {

        logger.debug('_loadContent: got content', this._loggingContext);
        result.contentType = response.headers['content-type'];
        result.body = response.body;
      })
      .catch((err) => {

        result.errorStatusCode = err.statusCode;

        if (err.statusCode === 404) {
          logger.info('_loadContent: page not found', this._loggingContext);
        } else {
          logger.error('_loadContent: error response from ' + url + ': ' + err.statusCode, this._loggingContext);
        }
      })
      .then(() => result);
  }
}