"use strict";

const Sequelize = require('sequelize');

const HostModel = {
  id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
  hostName: {type: Sequelize.STRING},
  // createdAt -- automatically added by sequelize
  // updatedAt -- automatically added by sequelize

  isProcessed: { type: Sequelize.BOOLEAN, defaultValue: false },
  priority: {type: Sequelize.ENUM('urgent', 'high', 'normal', 'low')}
};

module.exports = HostModel;