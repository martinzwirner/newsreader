"use strict";

const Sequelize = require('sequelize');
const priority = require('./priority');

const HostModel = {
  id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
  hostName: {type: Sequelize.STRING},
  // createdAt -- automatically added by sequelize
  // updatedAt -- automatically added by sequelize

  isProcessed: { type: Sequelize.BOOLEAN, defaultValue: false }
  //priority: { type: Sequelize.STRING, references: { model: priority, key: 'name' } }
};

module.exports = HostModel;