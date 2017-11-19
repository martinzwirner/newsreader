"use strict";

const requestify = require('requestify');

const database = require('./../database');

const hostManager = {

  get: function(hostName) {

    return database.getHostsResource().findOne({ where: { hostName: hostName }})
    .then((domain) => {

      if (domain != null) {
        return domain;
      }

      requestify.get('http://' + hostName + '/favicon.ico')
      .then((response) => {
        fs.writeFile('./data/favicons/' + hostName + '.ico', response.body);
      });

      return database.getHostsResource().create({
        hostName: hostName
      });
    });
  }
};

module.exports = hostManager;