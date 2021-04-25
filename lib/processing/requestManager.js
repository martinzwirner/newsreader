"use strict";

const request = require('request-promise');
const Twitter = require('twitter');

const Response = require('../businessObjects/Response');
const logger = require('../logger');

const tweetRegex = /https:\/\/twitter.com\/.+\/status\/.+/g;

module.exports = class requestManager {

  constructor(config, factory) {

    this._loggingContext = {
      source: "requestManager"
    };

    this._config = config;
    this._factory = factory;

    this._twitterClient = new Twitter({
      consumer_key: this._config.twitter_consumer_key,
      consumer_secret: this._config.twitter_consumer_secret,
      access_token_key: this._config.twitter_access_token_key,
      access_token_secret: this._config.twitter_access_token_secret
    });

  }

  request(url) {

    // TODO identify tweets
    if (tweetRegex.test(url)) {
      return this._requestTweet(url);
    } else {
      return this._requestViaHttp(url);
    }
  }

  _requestViaHttp(url) {

    const result = new Response();

    return request.get({
      url: url,
      timeout: this._config.requestTimeout,
      resolveWithFullResponse: true, // we need headers
      encoding: null, // handle binary data correctly
      followRedirect: (response) => {

        this._urlAfterRedirect = response.headers.location;
        logger.debug('_requestViaHttp: redirect to ', this._urlAfterRedirect, this._loggingContext);
        return true;
      }
    })
      .then((response) => {

        logger.debug('_requestViaHttp: got content', this._loggingContext);
        result.contentType = response.headers['content-type'];
        result.body = response.body;
      })
      .catch((err) => {

        result.errorStatusCode = err.statusCode;

        if (err.statusCode === 404) {
          logger.info('_requestViaHttp: page not found', this._loggingContext);
        } else {
          logger.error('_requestViaHttp: error response from ' + url + ': ' + err.statusCode, this._loggingContext);
        }
      })
      .then(() => result);
  }

  _requestTweet(url) {

    logger.debug(`requestTweet: requesting tweet ${url}`, this._loggingContext);

    return new Promise((resolve, reject) => {

      // get id from url
      const parts = url.replace("https://").split("/");
      const id = parts[3];

      logger.debug(`requestTweet: id ${id}`, this._loggingContext);
      var params = {id: id};

      // request tweet
      this._twitterClient.get('statuses/show', params, (error, data, response) => {

        // fill response object

        if (error) {
          console.error(error);
          reject(error);
        }

        logger.debug(`requestTweet: text ${data.text}`, this._loggingContext);
        const result = new Response();
        result.body = data.user.screen_name + ': ' + data.text;
        result.contentType = 'text/plain';
        resolve(result);
      });
    });
  }
}