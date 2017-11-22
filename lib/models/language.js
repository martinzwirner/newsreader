"use strict";

const Sequelize = require('sequelize');
const priority = require('./priority');

const LanguageModel = {
  code: {type: Sequelize.STRING(2), primaryKey: true}
  //priority: { type: Sequelize.STRING, references: { model: priority, key: 'name' } }
};

module.exports = LanguageModel;