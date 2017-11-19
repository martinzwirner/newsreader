"use strict";

const Sequelize = require('sequelize');
const logger = require('./logger');

const BookmarkModel = require('./models/bookmark');
const HostModel = require('./models/host');

const Database = {

  connect() {

    logger.info('connecting to database');

    this._db = new Sequelize(undefined, undefined, undefined, {
      dialect: 'sqlite',
      storage: './data/db.data',
      logging: true
    });

    return this._db.authenticate()
    .then(() => {
      logger.info('db connection successful');

      this._bookmarks = this._db.define('bookmark', BookmarkModel);
      this._hostsResource = this._db.define('host', HostModel);

      return this._db.sync({force: true}); // drop table if it exists
    });
  },

  getDatabase() {

    return this._db;
  },

  getBookmarksResource() {

    return this._bookmarks;
  },

  getHostsResource() {

    return this._hostsResource;
  }
};

module.exports = Database;