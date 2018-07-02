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

      logger.info('importing ' + filepath, this._loggingContext);
      const dom = new JSDOM(fs.readFileSync(filepath, 'utf8'));

      const lists = dom.window.document.getElementsByTagName("ul");
      logger.info('found ' + lists.length + ' lists', this._loggingContext);

      const bookmarks = new Set();
      const promises = [];

      for (let listIndex = 0; listIndex<2; listIndex++) {

        const list = lists[listIndex];

        var links = list.getElementsByTagName("a");
        logger.debug('found ' + links.length + ' links in list ' + listIndex, this._loggingContext);

        for(var i=0; i<links.length; i++) {

          promises.push(this._addLink(links, i, bookmarks, listIndex === 1));
        }
      }

      logger.info('found ' + promises.length +  ' links', this._loggingContext);

      Promise.all(promises)
      .then(() => { resolve(bookmarks); })
      .catch((err) => { reject(err); });
    });
  }

  _addLink(links, index, bookmarks, isViewed) {

    return new Promise((resolve) => {

      //logger.debug('link ' + (i+1) + '/' + links.length, this._loggingContext);
      const link = links[index];
      const url = link.href;
      let timeAdded = link.getAttribute("time_added");
      timeAdded = timeAdded ? timeAdded * 1000 : undefined;
      //logger.debug('found: ' + url, this._loggingContext);
      bookmarks.add(new PocketBookmark(url, timeAdded, isViewed));

      resolve();
    });
  }
}

module.exports = PocketHtmlExport;