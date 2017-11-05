"use strict";

const Http = require('./lib/http');
const Database = require('./lib/database');

new Http({ port: 8080 });

//new Database({ filename: './data/db.data' });