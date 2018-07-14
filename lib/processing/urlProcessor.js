"use strict";

const fs = require("fs");
const url = require("url");
const path = require('path');

const request = require('request-promise');
const franc = require('franc');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const logger = require('../logger');

class UrlProcessor {

  constructor(config, factory, bookmark) {

    this._config = config;
    this._factory = factory;
    this._bookmark = bookmark;

    this._database = factory.getInstance('database');
    this._helpers = factory.getInstance('helpers');
    this._hostManager = this._factory.getInstance('hostManager');

    this._body = undefined;
    this._dom = undefined;
    this._textContent = undefined;
    this._urlAfterRedirect = undefined;
    this._deleteBookmark = false;

    this._newValues = {
      isProcessed: true
    };

    this._virtualConsole = new jsdom.VirtualConsole();
    this._virtualConsole.sendTo(console, { omitJSDOMErrors: true });
  }

  start() {

    const url = this._bookmark.url;
    logger.info('start: requesting ' + url, this._loggingContext);

    return this._loadContent()
    .then(this._isUrlSaved.bind(this))
    .then((isUrlSaved) => {

      if (isUrlSaved) {

        logger.info('start: url already in db: ' + url, this._loggingContext);
        this._deleteBookmark = true;

      } else {

        logger.debug('start: got content for ' + this._bookmark.url, this._loggingContext);
        this._processContent();
      }
    })
    .catch((err) => {

      logger.error('start: error: ' + err.message + '\n' + err.stack, this._loggingContext);
    })
    .then(this._saveBookmark.bind(this));
  }

  _loadContent() {

    return request.get({
      url: this._bookmark.url,
      timeout: this._config.requestTimeout,
      followRedirect: (response) => {

        this._urlAfterRedirect = response.headers.location;
        logger.debug('_loadContent: redirect to ', this._urlAfterRedirect, this._loggingContext);
        return true;
      }
    })
    .then((body) => {

      logger.debug('_loadContent: got content', this._loggingContext);
      this._body = body;
    })
    .catch((err) => {

      this._newValues.errorStatusCode = err.statusCode;

      if (err.statusCode === 404) {
        logger.info('_loadContent: page not found', this._loggingContext);
      } else {
        logger.error('_loadContent: error response from ' + this._bookmark.url + ': ' + err.statusCode, this._loggingContext);
      }
    });
  }

  _isUrlSaved() {

    const url = this._urlAfterRedirect;

    if (!url) {

      return Promise.resolve(false);
    }

    return this._database.getBookmark(url)
    .then((bookmark) => {
      return bookmark != null && bookmark.id !== this._bookmark.id;
    });
  }

  _processContent() {

    if (this._urlAfterRedirect) {

      this._newValues.redirectingUrl = this._bookmark.url;
      this._newValues.url = this._urlAfterRedirect;
    }

    this._saveResponse();

    this._dom = new JSDOM(this._body, { virtualConsole: this._virtualConsole });

    this._extractMetaData();

    this._extractText();

    this._saveText();

    this._extractTextMetadata();
  }

  _saveResponse() {

    const contentPath = path.resolve(this._config.contentPath + this._getFilename(this._bookmark) + '.html');
    return this._helpers.writeFile(contentPath, this._body);
  }

  _extractMetaData() {

    this._newValues.hostname = url.parse(this._bookmark.url).hostname;

    this._newValues.title = this._dom.window.document.title;

    const headlines = this._dom.window.document.getElementsByTagName("h1");
    this._newValues.headline = headlines.length > 0 ? headlines[0].innerText : null;
  }

  _extractText() {

    // remove script and stylesheet tags
    const removeTags = ['script', 'style'];
    for (const tag of removeTags) {

      const elements = this._dom.window.document.getElementsByTagName(tag);

      for (const elem of elements) {

        elem.parentNode.removeChild(elem);
      }
    }

    // look for specific tags with a minimal length
    const tags = ['p', 'div'];
    const minimalLength = 140;
    const paragraphs = [];

    for (const tag of tags) {

      const elements = this._dom.window.document.getElementsByTagName(tag);

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

    this._textContent = paragraphs.join('\n');
  }

  _saveText() {

    const textContentPath = path.resolve(this._config.textContentPath + this._getFilename(this._bookmark) + '.txt');
    this._helpers.writeFile(textContentPath, this._textContent);
  }

  _extractTextMetadata() {

    this._newValues.contentLengthInCharacters = this._textContent.length;
    this._newValues.languageCode = franc(this._textContent);
  }

  _getFilename() {

    return url.parse(this._bookmark.url).hostname;
  }

  _saveBookmark() {

    if (this._deleteBookmark) {

      logger.info('_saveBookmark: deleting ' + this._bookmark.url, this._loggingContext);

      this._saveRedirectingUrl();

      return this._bookmark.destroy();
    }

    const setLanguagePromise = this._setLanguage();

    const setHostPromise = this._setHost();

    const saveBookmarkPromise = this._bookmark.update(this._newValues);

    return Promise.all([saveBookmarkPromise, setLanguagePromise, setHostPromise])
    .then(([bookmark, language, host]) => {

      logger.debug('_saveBookmark: calculating prio', this._loggingContext);

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

  _saveRedirectingUrl() {

    this._database.getBookmark(this._urlAfterRedirect)
    .then((oldBookmark) => {

      logger.info('_saveRedirectingUrl: found old bookmark with redirectingUrl ' +
        oldBookmark.dataValues.redirectingUrl, this._loggingContext);

      if (oldBookmark.dataValues.redirectingUrl == null) {

        logger.info('_saveRedirectingUrl: saving redirectingUrl', this._loggingContext);
        return oldBookmark.update({
          redirectingUrl: this._bookmark.url
        });

      } else {

        logger.info('_saveRedirectingUrl: old bookmark has redirectingUrl', this._loggingContext);
      }
    })
    .then(() => {
      logger.info('_saveRedirectingUrl: success', this._loggingContext);
    })
    .catch((err) => {
      logger.error('_saveRedirectingUrl: error: ' +
        err.message + '\n' + err.stack, this._loggingContext);
    });
  }

  _setLanguage() {

    const languageCode = this._newValues.languageCode;
    this._newValues.languageCode = null;

    if (!languageCode) {

      return Promise.resolve();
    }

    return this._database.getTable('language').findOne({ where: { code: languageCode }})
    .then((language) => {

      if (language === null) {

        logger.error('_saveBookmark: language ' + languageCode + ' not found (' + this._bookmark.url + ')', this._loggingContext);
        return;
      }

      return this._bookmark.setLanguage(language)
      .then(() => language);
    })
  }

  _setHost() {

    const hostname = this._newValues.hostname;
    this._newValues.hostname = null;

    if (!hostname) {
      return Promise.resolve();
    }

    return this._hostManager.get(hostname)
      .then((host) => {

        logger.debug('_saveBookmark: got host id ' + host.id + ' for hostname ' + hostname, this._loggingContext);
        return this._bookmark.setHost(host)
        .then(() => host);
      });

  }
}

module.exports = UrlProcessor;