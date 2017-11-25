"use strict";

const requestify = require('requestify');

const logger = require('./../logger');

class hostManager {

  constructor(config, factory) {

    this._loggingContext = {
      source: "processor"
    };
    this._config = config;
    this._factory = factory;
    this._database = factory.getInstance('database');
    this._helpers = factory.getInstance('helpers');
  }

  get(hostname) {

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

    const saveHostPromise = this._database.getTable('host').create({
      hostname: hostname
    });

    const saveFaviconPromise = requestify.get('http://' + hostname + '/favicon.ico')
    .catch((err) => {
      logger.error('_createHost: error getting favicon: ' + err.message + '\n' + err.stack);
    })
    .then((response) => {
      if (response) {
        const faviconPath = this._config.faviconPath + hostname + '.ico';
        return this._helpers.writeFile(faviconPath, response.body);
      }
    });

    return Promise.all([saveHostPromise, saveFaviconPromise])
    .then((results) => {
      return results[0];
    });
  }
};

module.exports = hostManager;