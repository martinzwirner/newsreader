"use strict";

const fs = require("fs");
const url = require("url");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const path = require('path');
const requestify = require('requestify');

const database = require('./../database');
const logger = require('./../logger');
const hostManager = require('./hostManager');

const processor = {

  startAsync: function() {

    logger.info('startAsync');
    setTimeout(this._processNext.bind(this), 0);
  },

  _processNext: function() {

    logger.info('starting processing');

    database.getBookmarksResource().findOne({where: { isProcessed: false },
      order: ['createdAt']
    }).then((bookmark) => {

      logger.debug('oldest bookmark: ' + JSON.stringify(bookmark));

      if (bookmark == null) {

        logger.info('nothing to process');
        return;
      }

      this._process(bookmark);
    })
    .catch((err) => {
      logger.error('error in start: ' + err.message + '\n' + err.stack);
    });
  },

  _process: function(bookmark) {

    const uri = bookmark.uri;
    logger.info('processing ' + uri);

    let title, headline;
    requestify.get(uri)
    .then((response) => {

      logger.debug('got content');

      const contentPath = path.resolve('./data/content/' + bookmark.id + '.html');
      fs.writeFile(contentPath, response.body);

      const dom = new JSDOM(response.body);
      title = dom.window.document.title;

      const headlines = dom.window.document.getElementsByTagName("h1");
      headline = headlines.length > 0 ? headlines[0].innerText : null;

      const hostname = url.parse(uri).hostname;
      return hostManager.get(hostname);
    })
    .then((host) => {
      return bookmark.update({
        title: title,
        headline: headline,
        host_id: host.id,
        isProcessed: true
      });
    })
    .then(() => {
      this.startAsync();
    })
    .catch((err) => {
      logger.error('error in processing: ' + err.message + '\n' + err.stack);
    });
  }
};

module.exports = processor;