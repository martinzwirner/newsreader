"use strict";

const Sequelize = require('sequelize');
const logger = require('./logger');

class Database {

  constructor(options) {

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

    this._bookmarks.sync({ force: true})
      .then(() => {
        logger.info('created bookmarks table');
      })
      .catch((err) => {
        logger.error('error creating bookmarks table', err);
      });
  }

  get(id) {

    return this._bookmarks.findById(id);
  }

  getAll(options) {

    return this._bookmarks.findAll();
  }

  add(bookmark) {

    return this._bookmarks.create(bookmark);
  }

  update(bookmark) {

    return this._bookmarks.update(bookmark);
  }
}

module.exports = Database;