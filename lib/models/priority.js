"use strict";

const Sequelize = require('sequelize');

const PriorityModel = {
  name: {type: Sequelize.STRING},
  value: {type: Sequelize.INTEGER, primaryKey: true}
};

module.exports = PriorityModel;