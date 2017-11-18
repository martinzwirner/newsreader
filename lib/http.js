"use strict";

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const epilogue = require('epilogue');
const Database = require('./database');
const importer = require('./importer');
const http = require('http');
const logger = require('./logger');
const PocketHtmlExport = require('./import/pocket/HtmlExport');

class Http {

  constructor(options) {

    this._options = options;

    this.createServer();

    this.connect();

    this._server.listen(this._options.port, () => {
      var host = this._server.address().address,
        port = this._server.address().port;

      console.log('listening at http://%s:%s', host, port);
    });
  }

  createServer() {

    this._app = express();

    this._app.use(bodyParser.urlencoded({extended: true}));
    this._app.use(bodyParser.json());

    this._app.use(express.static('./dist'));

    this._server = http.createServer(this._app);
  }

  connect() {

    epilogue.initialize({
      app: this._app,
      sequelize: Database.getDatabase()
    });

    epilogue.resource({
      model: Database.getBookmarks(),
      endpoints: ['/api/bookmarks', '/api/bookmarks/:id']
    });
  }
}

module.exports = Http;