"use strict";

const Sequelize = require('sequelize');
const priority = require('./priority');

const TagModel = {
  name: {type: Sequelize.STRING, primaryKey: true}
  //priority: { type: Sequelize.STRING, references: { model: priority, key: 'name' } }
};

module.exports = TagModel;