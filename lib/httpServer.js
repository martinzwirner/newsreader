"use strict";

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const finale = require('finale-rest');
const Database = require('./database');
const importer = require('./import/importer');
const http = require('http');
const logger = require('./logger');
const PocketHtmlExport = require('./import/pocket/HtmlExport');

class httpServer {

  constructor(config, factory) {

    this._loggingContext = {source: "httpServer"};
    this._config = config;
    this._factory = factory;
  }

  open() {

    this.createServer();

    this.connect();

    this._server.listen(this._config.port, () => {
      var host = this._server.address().address,
        port = this._server.address().port;

      logger.info('listening at http://%s:%s', host, port, this._loggingContext);
    });
  }

  createServer() {

    logger.debug('creating http server', this._loggingContext);

    this._app = express();

    this._app.use(bodyParser.urlencoded({extended: true}));
    this._app.use(bodyParser.json());

    this._app.use(express.static('./dist'));

    this._server = http.createServer(this._app);
  }

  connect() {

    logger.debug('configuring finale REST service', this._loggingContext);

    const db = this._factory.getInstance('database');

    finale.initialize({
      app: this._app,
      sequelize: db.getDatabase()
    });

    finale.resource({
      model: db.getTable('bookmark'),
      endpoints: ['/api/bookmarks', '/api/bookmarks/:id'],
      search: [
        {
          param: 'minCreatedAt',
          attributes: [ 'createdAt' ],
          operator: '$gte'
        },
        {
          param: 'maxCreatedAt',
          attributes: [ 'createdAt' ],
          operator: '$lte'
        },
        {
          param: 'minPriority',
          attributes: [ 'priorityValue' ],
          operator: '$lte'
        },
        {
          param: 'maxLength',
          attributes: [ 'contentLengthInCharacters' ],
          operator: '$lte'
        }
      ],
      sort: {
        param: 'orderby',
        attributes: [ 'title', 'contentLengthInCharacters', 'createdAt', 'url', 'tagName' ],
        default: '-contentLengthInCharacters'
      },
      pagination: true // default max is 100
    });

    finale.resource({
      model: db.getTable('host'),
      endpoints: ['/api/hosts', '/api/hosts/:id']
    });

    finale.resource({
      model: db.getTable('language'),
      endpoints: ['/api/languages', '/api/languages/:id']
    });
  }
}

module.exports = httpServer;