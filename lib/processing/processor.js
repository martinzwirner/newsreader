"use strict";

const fs = require("fs");
const url = require("url");
const path = require('path');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const requestify = require('requestify');
const rimraf = require('rimraf-promise');
const franc = require('franc');

const logger = require('./../logger');

class processor {

  constructor(config, factory) {

    this._loggingContext = {
      source: "processor"
    };
    this._config = config;
    this._factory = factory;

    this._database = this._factory.getInstance('database');
    this._helpers = this._factory.getInstance('helpers');

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

    const newValues = {
      isProcessed: true
    };

    const url = bookmark.url;
    logger.info('_process: requesting ' + url, this._loggingContext);

    let dom, textContent;

    return requestify.get(url, { redirect: true })
    .then((response) => {

      logger.debug('_process: got content for ' + bookmark.url, this._loggingContext);
      //logger.info('_process: ' + require('util').inspect(response), this._loggingContext);

      this._saveResponse(bookmark, response);

      dom = new JSDOM(response.body);

      this._extractMetaData(bookmark, dom, newValues);

      textContent = this._extractContentText(dom);

      this._saveTextContent(bookmark, textContent);

      this._extractContentInfo(bookmark, textContent, newValues);
    })
    .catch((err) => {

      logger.info('_process: error: ' + err.message + '\n' + err.stack, this._loggingContext);
    })
    .then(this._saveValues.bind(this, bookmark, newValues));
  }

  _saveResponse(bookmark, response) {

    const contentPath = path.resolve(this._config.contentPath + this._getFilename(bookmark) + '.html');
    return this._helpers.writeFile(contentPath, response.body);
  }

  _saveTextContent(bookmark, textContent) {

    const textContentPath = path.resolve(this._config.textContentPath + this._getFilename(bookmark) + '.txt');
    this._helpers.writeFile(textContentPath, textContent);
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

  _extractMetaData(bookmark, dom, newValues) {

    newValues.hostname = url.parse(bookmark.url).hostname;

    newValues.title = dom.window.document.title;

    const headlines = dom.window.document.getElementsByTagName("h1");
    newValues.headline = headlines.length > 0 ? headlines[0].innerText : null;
  }

  _extractContentInfo(bookmark, textContent, newValues) {

    newValues.contentLengthInCharacters = textContent.length;
    newValues.languageCode = franc(textContent);
  }

  _saveValues(bookmark, newValues) {

    const languageCode = newValues.languageCode;
    newValues.languageCode = null;

    const prom1 = this._database.getResource('language').findOne({ where: { code: languageCode }})
    .then((language) => {

      if (language === null) {

        logger.error('_saveValues: language ' + languageCode + ' not found', this._loggingContext);
        return;
      }

      return bookmark.setLanguage(language);
    });

    const prom2 = bookmark.update(newValues);

    return Promise.all([prom1, prom2]);
  }
}

module.exports = processor;