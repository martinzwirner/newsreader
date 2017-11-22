"use strict";

const Sequelize = require('sequelize');
const logger = require('./logger');

const models = {
  bookmark: require('./models/bookmark'),
  host    : require('./models/host'),
  language: require('./models/language'),
  priority: require('./models/priority'),
  tag     : require('./models/tag')
};

class database {

  constructor(config) {

    this._config = config;
    this._loggingContext = {
      source: "Database"
    };

    this._models = ['priority', 'host', 'language', 'tag', 'bookmark'];
    this._resources = new Map();
  }

  connect() {

    logger.info('connecting to database', this._loggingContext);

    this._db = new Sequelize(undefined, undefined, undefined, {
      dialect: 'sqlite',
      storage: this._config.storagePath,
      logging: this._config.enableLogging
    });

    return this._db.authenticate()
    .then(() => {
      logger.info('db connection successful', this._loggingContext);

      for (let model of this._models) {

        logger.info('creating ' + model + ' resource', this._loggingContext);
        this._resources.set(model, this._db.define(model, models[model]));
      }

      this._resources.get('bookmark').belongsTo(this._resources.get('priority'));
      this._resources.get('bookmark').belongsTo(this._resources.get('host'));
      this._resources.get('bookmark').belongsTo(this._resources.get('language'));
      this._resources.get('bookmark').belongsTo(this._resources.get('tag'));

      this._resources.get('host').belongsTo(this._resources.get('priority'));
      this._resources.get('language').belongsTo(this._resources.get('priority'));
      this._resources.get('tag').belongsTo(this._resources.get('priority'));

      logger.info('syncing with database', this._loggingContext);
      return this._db.sync({force: this._config.createDatabase});
    });
  }

  getDatabase() {

    return this._db;
  }

  getResource(name) {

    return this._resources.get(name);
  }
}

module.exports = database;