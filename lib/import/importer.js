"use strict";

const path = require('path');

const Database = require('./../database');
const logger = require('./../logger');

class importer {

  constructor(config, factory) {

    this._loggingContext = {source: "importer"};
    this._config = config;
    this._factory = factory;
    this._database = this._factory.getInstance('database');
  }

  importFrom(source) {

    if (!this._config.filePath) {

      return Promise.resolve();
    }

    const filepath = path.resolve(this._config.filePath);

    return source.getUrls(filepath)
    .then(this._processUrls.bind(this));
  }

  _processUrls(bookmarks) {

    logger.debug('got ' + bookmarks.size + ' bookmarks', this._loggingContext);

    this._bookmarks = Array.from(bookmarks);
    this._bookmarksTable = this._factory.getInstance('database').getTable('bookmark');

    this._processUrl(0);
  }

  _processUrl(index) {

    if (index == this._bookmarks.length) {

      logger.info('_processUrl: finished', this._loggingContext);
      return;
    }

    logger.debug('_processUrl: ' + (index + 1) + ' / ' + this._bookmarks.length, this._loggingContext);
    const importedBookmark = this._bookmarks[index];
    const url = importedBookmark.url;
    logger.debug('_processUrl: ' + url, this._loggingContext);

    this._database.getBookmark(url)
    .then(this._createBookmark.bind(this, importedBookmark))
    .then((success) => {

      this._processUrl(++index);
    });
  }

  _createBookmark(importedBookmark, bookmark) {

    const url = importedBookmark.url;

    if (bookmark) {

      logger.debug('_createBookmark: url found in bookmarks: ' + url, this._loggingContext);
      if (importedBookmark.isViewed && !bookmark.isViewed) {

        logger.debug('_createBookmark: updating isViewed for: ' + url, this._loggingContext);
        return bookmark.update({
          isViewed: true
        });
      }
      return Promise.resolve(false);
    }

    logger.info('_createBookmark: adding to bookmarks: ' + url, this._loggingContext);

    const bookmarksTable = this._database.getTable('bookmark');

    return bookmarksTable.create({
      url: url,
      createdAt: new Date(importedBookmark.timeAdded)
    })
    .then((bookmark) => {

      bookmark.setPriority(this._database.getDefaultPriority())
      .catch((err) => {
        logger.error('_createBookmark: error when setting priority: ' + err.message + '\n' + err.stack, this._loggingContext);
      });
      this._factory.getInstance('processor').startAsync();
      return true;
    });
  }
}

module.exports = importer;