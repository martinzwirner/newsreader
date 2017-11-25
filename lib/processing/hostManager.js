"use strict";

const fs = require('fs');

const request = require('request');
const requestify = require('requestify');
const rimraf = require('rimraf-promise');

const logger = require('./../logger');

class hostManager {

  constructor(config, factory) {

    this._loggingContext = {
      source: "hostManager"
    };
    this._config = config;
    this._factory = factory;
    this._database = factory.getInstance('database');
    this._helpers = factory.getInstance('helpers');

    if (this._config.cleanOnStart) {

      rimraf(this._config.faviconPath)
      .then(() => {
        fs.mkdir(this._config.faviconPath)
      });
    }
  }

  get(hostname) {

    if (hostname === undefined) {

      return Promise.resolve();
    }

    return this._database.getTable('host').findOne({ where: { hostname: hostname }})
    .then((host) => {

      if (host != null) {

        logger.debug('get: found host ' + hostname, this._loggingContext);
        return host;
      }

      return this._createHost(hostname);
    });
  }

  _createHost(hostname) {

    logger.debug('_createHost: creating host ' + hostname, this._loggingContext);

    return this._database.getTable('host').create({
      hostname: hostname
    })
    .then((host) => {

      this._saveFavicon(host);

      return host.setPriority(this._database.getDefaultPriority());
    })
  }

  _saveFavicon(host) {

    const hostname = host.hostname;
    const faviconPath = this._config.faviconPath + hostname + '.ico';

    const defaultUrl = 'http://' + hostname + '/favicon.ico';
    request(defaultUrl).pipe(fs.createWriteStream(faviconPath));

    /*requestify.get(defaultUrl, { redirect: true, encoding: 'binary' })
    .catch((response) => {

      logger.warn('_createHost: error getting ' + defaultUrl + ': ' + response.code + ' ' + response.body, this._loggingContext);
    })
    .then((response) => {

      if (response) {

        logger.warn('_createHost: saving favicon for ' + hostname + ' as ' + faviconPath, this._loggingContext);
        this._helpers.writeFile(faviconPath, response.body);
      }
    });*/
  }
};

module.exports = hostManager;