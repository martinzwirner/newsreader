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
    })
    .then(() => {

      if (this._config.createDatabase) {

        return this._insertDefaultValues();
      }
    });
  }

  getDatabase() {

    return this._db;
  }

  getResource(name) {

    return this._resources.get(name);
  }

  _insertDefaultValues() {

    logger.info('_insertDefaultValues', this._loggingContext);

    const priorityResource = this._resources.get('priority');

    const createPriorities = [
      priorityResource.create({ name: 'urgent', value: 5 }),
      priorityResource.create({ name: 'high', value: 10 }),
      priorityResource.create({ name: 'normal', value: 15 }),
      priorityResource.create({ name: 'low', value: 20 })
    ];

    return Promise.all(createPriorities)
    .then((priorities) => {

      const languageResource = this._resources.get('language');

      const createLanguages = [
        languageResource.create({code: 'deu'}),
        languageResource.create({code: 'eng'})
      ];

      return Promise.all(createLanguages)
      .then((languages) => {

        languages[0].setPriority(priorities[0]);
        languages[1].setPriority(priorities[1]);
      });
    });
  }
}

module.exports = database;