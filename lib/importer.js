"use strict";

const path = require('path');

const Database = require('./database');
const logger = require('./logger');

module.exports = {

  import: function(source) {

    new Promise((resolve, reject) => {

      const bookmarksResource = Database.getBookmarks();
      const filepath = path.resolve('./data/pocket/ril_export.html');
      const urls = source.getUrls(filepath);
      const promises = [];
      let count = 0;

      for(let url of urls) {

        promises.push(bookmarksResource.findOne({ where: { uri: url } })
        .then((bookmark) => {

          if (bookmark == null) {

            logger.debug('adding to bookmarks: ' + url);
            bookmarksResource.create({
              uri: url
            });
            count++;
          }
        }));
      }

      Promise.all(promises)
      .then(() => {
        logger.info(count + ' urls where added to the bookmarks');
      })
    });
  }
};
