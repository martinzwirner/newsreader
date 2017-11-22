"use strict";

const fs = require("fs");
const url = require("url");
const path = require('path');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const requestify = require('requestify');
const rimraf = require('rimraf-promise');

const logger = require('./../logger');
const hostManager = require('./hostManager');

class processor {

  constructor(config, factory) {

    this._loggingContext = {
      source: "processor"
    };
    this._config = config;
    this._factory = factory;

    this._database = this._factory.getInstance('database');

    this._isRunning = false;

    if (this._config.cleanOnStart) {

      const promises = [];

      promises.push(rimraf(this._config.contentPath));
      promises.push(rimraf(this._config.textContentPath));

      Promise.all(promises)
      .then(() => {
        fs.mkdir(this._config.contentPath);
        fs.mkdir(this._config.textContentPath);
      })
      .catch((err) => {
        logger.error('constructor: error on cleaning: ' + err.message + '\n' + err.stack, this._loggingContext);
      });
    }
  }

  startAsync() {

    if (this._isRunning) {

      logger.debug('startAsync: already running', this._loggingContext);
      return;
    }

    logger.info('startAsync: starting', this._loggingContext);
    this._isRunning = true;

    setTimeout(this._processNext.bind(this), 0);
  }

  _processNext() {

    logger.info('processing next bookmark', this._loggingContext);

    this._database.getResource('bookmark').findOne({where: { isProcessed: false },
      order: ['createdAt']
    }).then((bookmark) => {

      if (bookmark == null) {

        logger.info('nothing to process', this._loggingContext);
        this._isRunning = false;
        return;
      }

      logger.debug('oldest bookmark: ' + JSON.stringify(bookmark), this._loggingContext);
      return this._process(bookmark);
    })
    .then(() => {

      logger.info('processing done', this._loggingContext);

      if (this._isRunning) {

        this._processNext();
      }
    })
    .catch((err) => {

      logger.error('error in _processNext: ' + err.message + '\n' + err.stack, this._loggingContext);
    });
  }

  _process(bookmark) {

    const url = bookmark.url;
    logger.info('_process: requesting ' + url, this._loggingContext);

    return requestify.get(url, { redirect: true })
    .then(this._handleResponse.bind(this, bookmark));
  }

  _handleResponse(bookmark, response) {

    logger.debug('_handleResponse: got content for ' + bookmark.url, this._loggingContext);
    logger.info('_handleResponse: ' + require('util').inspect(response), this._loggingContext);

    const contentPath = path.resolve(this._config.contentPath + this._getFilename(bookmark) + '.html');
    fs.writeFile(contentPath, response.body, (err) => {
      if (err) {
        logger.error('_handleResponse: error writing ' + contentPath + ': ' + err.message + '\n' + err.stack, this._loggingContext);
      } else {
        logger.debug('_handleResponse: wrote ' + contentPath, this._loggingContext);
      }
    });

    let isParsed = false;
    let dom;

    try {

      dom = new JSDOM(response.body);
      isParsed = true;

    } catch (err) {

      logger.error('_handleResponse: error parsing ' + url + ': ' + err.message + '\n' + err.stack, this._loggingContext);
    }

    let title, headline, textContent;

    if (isParsed) {

      title = dom.window.document.title;

      const headlines = dom.window.document.getElementsByTagName("h1");
      headline = headlines.length > 0 ? headlines[0].innerText : null;

      //const hostname = url.parse(url).hostname;
      //return hostManager.get(hostname);

      textContent = this._extractContentText(dom);
      const textContentPath = path.resolve(this._config.textContentPath + this._getFilename(bookmark) + '.txt');
      fs.writeFile(textContentPath, textContent, (err) => {
        if (err) {
          logger.error('_handleResponse: error writing ' + textContentPath + ': ' + err.message + '\n' + err.stack, this._loggingContext);
        } else {
          logger.debug('_handleResponse: wrote ' + textContentPath, this._loggingContext);
        }
      });
    }

    return bookmark.update({
      hostname: url.parse(bookmark.url).hostname,
      title: title,
      headline: headline,
      contentLengthInCharacters: textContent ? textContent.length : null,
      //host_id: host.id,
      isProcessed: true
    });
  }

  _extractContentText(dom) {

    // remove script and stylesheet tags
    const removeTags = ['script', 'style'];
    for (const tag of removeTags) {

      const elements = dom.window.document.getElementsByTagName(tag);

      for (const elem of elements) {

        elem.parentNode.removeChild(elem);
      }
    }

    // look for specific tags with a minimal length
    const tags = ['p', 'div'];
    const minimalLength = 140;
    const paragraphs = [];

    for (const tag of tags) {

      const elements = dom.window.document.getElementsByTagName(tag);

      for (const elem of elements) {

        // check if there is another element of the same type nested
        let found = false;
        for (const innerTag of tags) {

          const innerElements = elem.getElementsByTagName(innerTag);
          if (innerElements.length >= 1) {

            found = true;
            break;
          }
        }

        if (found) {

          continue;
        }

        // get only text content
        let content = elem.textContent;

        // remove whitespace
        content = content.replace(/\s+/g, ' ');

        if (content.length >= minimalLength) {

          paragraphs.push(content);
        }
      }
    }

    return paragraphs.join('\n');
  }

  _getFilename(bookmark) {

    return url.parse(bookmark.url).hostname;
  }
}

module.exports = processor;