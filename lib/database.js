"use strict";

const Sequelize = require('sequelize');
const logger = require('./logger');

const Database = {

  connect() {

    logger.info('connecting to database');

    this._db = new Sequelize(undefined, undefined, undefined, {
      dialect: 'sqlite',
      storage: './data/db.data'
    });

    return this._db.authenticate()
      .then(() => {
        logger.info('db connection successful');

        this._bookmarks = this._db.define('bookmark', {
          id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
          uri: {type: Sequelize.STRING},
          priority: {type: Sequelize.ENUM('urgent', 'high', 'normal', 'low')}
        });

        logger.info('created bookmarks model');
      });
  },

  getDatabase() {

    return this._db;
  },

  getBookmarks() {

    return this._bookmarks;
  }
};

module.exports = Database;