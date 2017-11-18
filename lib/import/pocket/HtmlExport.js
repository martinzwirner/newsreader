"use strict";

const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const logger = require('../../logger');

const PocketHtmlExport = {
  
  getUrls(filepath) {

    var dom = new JSDOM(fs.readFileSync(filepath, 'utf8'));

    var links = dom.window.document.getElementsByTagName("a");
    logger.info('found ' + links.length + ' links in document');

    const urls = new Set();

    for(var i=0; i<links.length; i++) {

      logger.debug('link ' + (i+1) + '/' + links.length);
      const url = links[i].href;
      logger.debug('found: ' + url);
      urls.add(url);
    }

    return urls;
  }
};

module.exports = PocketHtmlExport;