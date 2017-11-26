"use strict";

const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const logger = require('../../logger');
const PocketBookmark = require('./pocketBookmark');

class PocketHtmlExport {

  constructor(config, factory) {

    this._config = config;
    this._factory = factory;
    this._loggingContext = {
      source: "PocketHtmlExport"
    }
  }

  getUrls(filepath) {

    return new Promise((resolve, reject) => {

      var dom = new JSDOM(fs.readFileSync(filepath, 'utf8'));

      var links = dom.window.document.getElementsByTagName("a");
      logger.info('found ' + links.length + ' links in document', this._loggingContext);

      const bookmarks = new Set();
      const promises = [];

      for(var i=0; i<links.length; i++) {

        promises.push(this._addLink(links, i, bookmarks));
      }

      logger.info('found ' + bookmarks.size + ' different links', this._loggingContext);

      Promise.all(promises)
      .then(() => { resolve(bookmarks); })
      .catch((err) => { reject(err); });
    });
  }

  _addLink(links, index, bookmarks) {

    return new Promise((resolve) => {

      //logger.debug('link ' + (i+1) + '/' + links.length, this._loggingContext);
      const link = links[index];
      const url = link.href;
      let timeAdded = link.getAttribute("time_added");
      timeAdded = timeAdded ? timeAdded * 1000 : undefined;
      //logger.debug('found: ' + url, this._loggingContext);
      bookmarks.add(new PocketBookmark(url, timeAdded));

      resolve();
    });
  }
}

module.exports = PocketHtmlExport;