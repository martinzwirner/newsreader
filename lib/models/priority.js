"use strict";

const Sequelize = require('sequelize');

const PriorityModel = {
  name: {type: Sequelize.STRING, primaryKey: true},
  value: {type: Sequelize.INTEGER}
};

module.exports = PriorityModel;