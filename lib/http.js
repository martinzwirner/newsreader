"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const epilogue = require('epilogue');
const Sequelize = require('sequelize');
const http = require('http');
const logger = require('./logger');

class Http {

  constructor(options) {

    this._options = options;

    this.createDB();

    this.createServer();

    this.connect();
  }

  createServer() {

    this._app = express();
    this._app.use(bodyParser.urlencoded({extended: true}));
    this._app.use(bodyParser.json());
    this._server = http.createServer(this._app);
  }

  createDB() {

    this._db = new Sequelize(undefined, undefined, undefined, {
      dialect: 'sqlite',
      storage: './data/db.data'
    });

    this._db.authenticate()
      .then(() => {
        logger.info('db connection successful');
      })
      .catch((err) => {
        logger.info('db connection failed with ', err);
      });

    this._bookmarks = this._db.define('bookmark', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true },
      uri: { type: Sequelize.STRING },
      priority: { type: Sequelize.ENUM('urgent','high','normal','low') }
    });
  }

  connect() {

    epilogue.initialize({
      app: this._app,
      sequelize: this._db
    });

    // Create REST resource
    var bookmarkResource = epilogue.resource({
      model: this._bookmarks,
      endpoints: ['/api/bookmarks', '/api/bookmarks/:id']
    });

    // Create database and listen
    this._db
      .sync({ force: true })
      .then(() => {
        this._server.listen(this._options.port, () => {
          var host = this._server.address().address,
            port = this._server.address().port;

          console.log('listening at http://%s:%s', host, port);
        });
      });
  }
}

module.exports = Http;