"use strict";

const path = require('path');

const Database = require('./../database');
const logger = require('./../logger');

class importer {

  constructor(config, factory) {

    this._loggingContext = {source: "importer"};
    this._config = config;
    this._factory = factory;
  }

  importFrom(source) {

    const filepath = path.resolve(this._config.filePath);

    return source.getUrls(filepath)
    .then(this._processUrls.bind(this))
    .then((results) => {
      let count = 0;
      for (let v of results) {
        count += v ? 1 : 0;
      }
      logger.info(count + ' urls were added to the bookmarks', this._loggingContext);
    })
    .catch((err) => {
      logger.error('error on import: ' + err.message + '\n' + err.stack, this._loggingContext);
    });
  }

  _processUrls(urls) {

    logger.debug('got ' + urls.size + ' urls', this._loggingContext);

    const promises = [];
    const bookmarksResource = this._factory.getInstance('database').getResource('bookmark');

    for (let url of urls) {

      const promise = bookmarksResource.findOne({where: {url: url}})
      .then(this._createBookmark.bind(this, url));

      promises.push(promise);
    }

    logger.info('starting adding', this._loggingContext);

    return Promise.all(promises);
  }

  _createBookmark(url, bookmark) {

    if (bookmark !== null) {

      logger.debug('url found in bookmarks: ' + url, this._loggingContext);
      return Promise.resolve(false);
    }

    logger.debug('adding to bookmarks: ' + url, this._loggingContext);

    const bookmarksResource = this._factory.getInstance('database').getResource('bookmark');

    return bookmarksResource.create({
      url: url
    })
    .then(() => {
      this._factory.getInstance('processor').startAsync();
      return true;
    });
  }
}

module.exports = importer;