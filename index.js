"use strict";

const Http = require('./lib/http');
const importer = require('./lib/importer');
const Database = require('./lib/database');
const PocketHtmlExport = require('./lib/import/pocket/HtmlExport');

Database.connect()
.then(() => {

  importer.import(PocketHtmlExport);

  new Http({port: 8080});
});
