"use strict";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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

    this._tables = new Map();
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

      for (let model in models) {

        logger.debug('creating table ' + model, this._loggingContext);
        this._tables.set(model,
          this._db.define(model, models[model],
            { paranoid: false } // enable to insert deletedAt column
            ));
      }

      this._createAssociations();

      logger.info('syncing with database', this._loggingContext);
      return this._db.sync({force: this._config.createDatabase});
    })
    .then(() => {

      if (this._config.createDatabase) {

        return this._insertDefaultValues();

      } else {

        return this._tables.get('priority').findOne({ where: { name: "normal" } })
        .then((defaultPrio) => {

          this._defaultPriority = defaultPrio;
        })
      }
    });
  }

  getDatabase() {

    return this._db;
  }

  getTable(name) {

    return this._tables.get(name);
  }

  getBookmark(url) {

    return this.getTable('bookmark').findAll(
      {
        where: {
          [Op.or]: [{url: url}, {redirectingUrl: url}]
        }
      }
    )
    .then((arr) => arr[0]);
  }

  _createAssociations() {

    const bookmarkTable = this._tables.get('bookmark');
    const priorityTable = this._tables.get('priority');

    bookmarkTable.belongsTo(priorityTable);
    bookmarkTable.belongsTo(this._tables.get('host'));
    bookmarkTable.belongsTo(this._tables.get('language'));
    bookmarkTable.belongsTo(this._tables.get('tag'));

    this._tables.get('host').belongsTo(priorityTable);
    this._tables.get('language').belongsTo(priorityTable);
    this._tables.get('tag').belongsTo(priorityTable);
  }

  _insertDefaultValues() {

    logger.info('_insertDefaultValues', this._loggingContext);

    const priorityTable = this._tables.get('priority');
    const createPriorities = [
      priorityTable.create({ name: 'urgent', value: 5 }),
      priorityTable.create({ name: 'high', value: 10 }),
      priorityTable.create({ name: 'normal', value: 15 }),
      priorityTable.create({ name: 'low', value: 20 })
    ];

    const languageTable = this._tables.get('language');
    const createLanguages = [
      languageTable.create({code: 'deu'}),
      languageTable.create({code: 'eng'})
    ];

    return Promise.all(createPriorities)
    .then(Promise.all(createLanguages))
    .then((languages) => {

      this._defaultPriority = priorities[2];
      languages[0].setPriority(priorities[0]);
      languages[1].setPriority(priorities[1]);
    });
  }

  getDefaultPriority() {

    return this._defaultPriority;
  }
}

module.exports = database;