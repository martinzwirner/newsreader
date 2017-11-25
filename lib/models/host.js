"use strict";

const Sequelize = require('sequelize');
const priority = require('./priority');

const HostModel = {
  id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
  hostname: {type: Sequelize.STRING},
  // createdAt -- automatically added by sequelize
  // updatedAt -- automatically added by sequelize
};

module.exports = HostModel;