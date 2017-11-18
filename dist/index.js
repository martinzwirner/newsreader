"use strict";

var Http = require('./lib/http');
var importer = require('./lib/importer');
var Database = require('./lib/database');
var PocketHtmlExport = require('./lib/import/pocket/HtmlExport');

Database.connect().then(function () {

  importer.import(PocketHtmlExport);

  new Http({ port: 8080 });
});
//# sourceMappingURL=index.js.map