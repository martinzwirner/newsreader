"use strict";

const fs = require("fs");
const url = require("url");
const path = require('path');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request = require('request-promise');
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
    this._hostManager = this._factory.getInstance('hostManager');

    this._isRunning = false;

    this._virtualConsole = new jsdom.VirtualConsole();
    this._virtualConsole.sendTo(console, { omitJSDOMErrors: true });

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

      //logger.debug('startAsync: already running', this._loggingContext);
      return;
    }

    logger.info('startAsync: starting', this._loggingContext);
    this._isRunning = true;

    setTimeout(this._processNext.bind(this), 0);
  }

  _processNext() {

    logger.info('_processNext: processing next bookmark', this._loggingContext);

    this._database.getTable('bookmark').count({where: { isProcessed: false }})
    .then((count) => {
      logger.info('_processNext: ' + count + ' to go', this._loggingContext);
    });

    this._database.getTable('bookmark').findOne({where: { isProcessed: false },
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

    let dom, textContent, lastUrl, body;

    return request.get({
      url: url,
      followRedirect: function(response) {
        lastUrl = response.headers.location;
        logger.debug('_process: redirect to ', lastUrl, this._loggingContext);
        return true;
      }
    })
    .catch((err) => {
      newValues.errorStatusCode = err.statusCode;
      if (err.statusCode === 404) {
        logger.info('_process: page not found', this._loggingContext);
      } else {
        logger.error('_process: error response from ' + bookmark.url + ': ' + err.statusCode, this._loggingContext);
      }
    })
    .then((b) => {

      if (!b) {

        return;
      }

      body = b;

      if (lastUrl !== undefined) {

        return this._isUrlSaved(lastUrl);
      }

      return false;
    })
    .then((isUrlSaved) => {

      if (isUrlSaved) {

        logger.info('_process: redirect target already in db!', this._loggingContext);
        newValues.__delete = true;
        return;
      }

      newValues.url = lastUrl;

      logger.debug('_process: got content for ' + bookmark.url, this._loggingContext);
      //logger.info('_process: ' + require('util').inspect(response), this._loggingContext);

      this._saveResponse(bookmark, body);

      dom = new JSDOM(body, { virtualConsole: this._virtualConsole });

      this._extractMetaData(bookmark, dom, newValues);

      textContent = this._extractContentText(dom);

      this._saveTextContent(bookmark, textContent);

      this._extractContentInfo(bookmark, textContent, newValues);
    })
    .catch((err) => {

      logger.error('_process: error: ' + err.message + '\n' + err.stack, this._loggingContext);
    })
    .then(this._saveValues.bind(this, bookmark, newValues));
  }

  _saveResponse(bookmark, body) {

    const contentPath = path.resolve(this._config.contentPath + this._getFilename(bookmark) + '.html');
    return this._helpers.writeFile(contentPath, body);
  }

  _saveTextContent(bookmark, textContent) {

    const textContentPath = path.resolve(this._config.textContentPath + this._getFilename(bookmark) + '.txt');
    this._helpers.writeFile(textContentPath, textContent);
  }

  _isUrlSaved(url) {

    return this._database.getTable('bookmark').findOne({where: {url: url}})
    .then((bookmark) => {
      return bookmark != null;
    })
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

    if (newValues.__delete) {

      logger.info('_saveValues: deleting ' + bookmark.url, this._loggingContext);
      return bookmark.destroy();
    }

    const languageCode = newValues.languageCode;
    newValues.languageCode = null;

    const hostname = newValues.hostname;
    newValues.hostname = null;

    const setLanguagePromise = languageCode === undefined ? Promise.resolve() :
      this._database.getTable('language').findOne({ where: { code: languageCode }})
      .then((language) => {

        if (language === null) {

          logger.error('_saveValues: language ' + languageCode + ' not found (' + bookmark.url + ')', this._loggingContext);
          return;
        }

        return bookmark.setLanguage(language)
        .then(() => language);
      });

    const setHostPromise = hostname === undefined ? Promise.resolve() :
      this._hostManager.get(hostname)
      .then((host) => {

        logger.debug('_saveValues: got host id ' + host.id + ' for hostname ' + hostname, this._loggingContext);
        return bookmark.setHost(host)
        .then(() => host);
      });

    const saveBookmarkPromise = bookmark.update(newValues);

    return Promise.all([saveBookmarkPromise, setLanguagePromise, setHostPromise])
    .then(([bookmark, language, host]) => {

      logger.debug('_saveValues: calculating prio', this._loggingContext);

      const defaultPriority = this._database.getDefaultPriority();
      const prio = (bookmark.dataValues.priorityValue +
        (language ? language.dataValues.priorityValue : defaultPriority.dataValues.value) +
        (host ? host.dataValues.priorityValue : defaultPriority.dataValues.value)) *
        (bookmark.dataValues.contentLengthInCharacters / 1000);
      return bookmark.update({
        calculatedPriority: prio
      });
    });
  }

  _setLanguage(bookmark, languageCode) {

  }
}

module.exports = processor;