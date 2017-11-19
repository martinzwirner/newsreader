"use strict";

const Sequelize = require('sequelize');
const domain = require('./host');

const BookmarkModel = {
  id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
  uri: {type: Sequelize.STRING},
  // createdAt -- automatically added by sequelize
  // updatedAt -- automatically added by sequelize

  isProcessed: { type: Sequelize.BOOLEAN, defaultValue: false },
  priority: {type: Sequelize.ENUM('urgent', 'high', 'normal', 'low')},

  title: { type: Sequelize.STRING },
  headline: { type: Sequelize.STRING },

  /*domain_id: {
    type: Sequelize.UUID,
    references: {
      model: domain,
      key: 'id'
    }
  }*/
};

module.exports = BookmarkModel;