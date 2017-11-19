"use strict";

const path = require('path');

const Database = require('./../database');
const logger = require('./../logger');

module.exports = {

  import: function(source) {

    const bookmarksResource = Database.getBookmarksResource();
    const filepath = path.resolve('./data/pocket/ril_export.html');
    let count = 0;

    return source.getUrls(filepath)
    .then((urls) => {

      logger.debug('got ' + urls.size + ' urls');

      const promises = [];

      for (let url of urls) {

        promises.push(bookmarksResource.findOne({where: {uri: url}})
        .then((bookmark) => {

          if (bookmark == null) {

            logger.debug('adding to bookmarks: ' + url);
            bookmarksResource.create({
              uri: url
            })
            .catch((err) => {
              logger.error('error in creating bookmark: ' + err.message + '\n' + err.stack);
            });
            count++;
          }
        })
        .catch((err) => {
          logger.error('error in searching bookmark: ' + err.message + '\n' + err.stack);
        }));
      }

      logger.info('starting adding');
      return Promise.all(promises);
    })
    .then(() => {
      logger.info(count + ' urls were added to the bookmarks');
    })
    .catch((err) => {
      logger.error('error in importer: ' + err.message + '\n' + err.stack);
    });
  }
};
