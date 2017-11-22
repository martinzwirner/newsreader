"use strict";

const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const logger = require('../../logger');

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

      const urls = new Set();
      const promises = [];

      for(var i=0; i<links.length; i++) {

        promises.push(this._addLink(links, i, urls));
      }

      logger.info('found ' + urls.size + ' different links', this._loggingContext);

      Promise.all(promises)
      .then(() => { resolve(urls); })
      .catch((err) => { reject(err); });
    });
  }

  _addLink(links, index, urls) {

    return new Promise((resolve) => {

      //logger.debug('link ' + (i+1) + '/' + links.length, this._loggingContext);
      const url = links[index].href;
      //logger.debug('found: ' + url, this._loggingContext);
      urls.add(url);

      resolve();
    });
  }
}

module.exports = PocketHtmlExport;