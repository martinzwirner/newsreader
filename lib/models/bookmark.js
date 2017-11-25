"use strict";

const Sequelize = require('sequelize');
const domain = require('./host');
const priority = require('./priority');
const language = require('./language');

const BookmarkModel = {
  id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
  url: {type: Sequelize.STRING},
  // createdAt -- automatically added by sequelize
  // updatedAt -- automatically added by sequelize

  isProcessed: { type: Sequelize.BOOLEAN, defaultValue: false },

  title: { type: Sequelize.STRING },
  headline: { type: Sequelize.STRING },
  contentType: {type: Sequelize.ENUM('text', 'video', 'audio', 'image')},
  contentLengthInCharacters: { type: Sequelize.INTEGER },
  contentLengthInSeconds: { type: Sequelize.INTEGER },
  contentDate: { type: Sequelize.DATE },

  isViewed: { type: Sequelize.BOOLEAN, defaultValue: false }
};

module.exports = BookmarkModel;