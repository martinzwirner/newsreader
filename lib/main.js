"use strict";

const logger = require('./logger');
const helpers = require('./helpers');
const factory = require('./factory');
const httpServer = require('./httpServer');
const importer = require('./import/importer');
const processor = require('./processing/processor');
const database = require('./database');
const hostManager = require('./processing/hostManager');
const PocketHtmlExport = require('./import/pocket/HtmlExport');

class main {

  constructor(config) {

    this._config = config;

    this._initModules();

    this._start();
  }

  _initModules() {

    this._factory = new factory();

    this._helpers = new helpers();
    this._factory.setInstance('helpers', this._helpers);

    this._database = new database(this._config.database, this._factory);
    this._factory.setInstance('database', this._database);

    this._importer = new importer(this._config.importer, this._factory);
    this._factory.setInstance('importer', this._importer);

    this._httpServer = new httpServer(this._config.httpServer, this._factory);
    this._factory.setInstance('httpServer', this._httpServer);

    this._hostManager = new hostManager(this._config.hostManager, this._factory);
    this._factory.setInstance('hostManager', this._hostManager);

    this._processor = new processor(this._config.processor, this._factory);
    this._factory.setInstance('processor', this._processor);
  }

  _start() {

    this._database.connect()
    .then(() => {

      logger.debug('db connection established', { source: 'Main' });

      const importSource = new PocketHtmlExport();
      logger.debug('_start: starting import', { source: 'Main' });
      this._importer.importFrom(importSource);
      logger.debug('_start: starting processing', { source: 'Main' });
      this._processor.startAsync();

      logger.debug('_start: starting http server', { source: 'Main' });
      this._httpServer.open();
    });
  }
}

module.exports = main;