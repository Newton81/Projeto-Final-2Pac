const express = require('express');
const path = require('path');

const api = express();

api.use(express.static(path.join(__dirname, '')));

api.use('/', express.static('index.html'));

module.exports = api;
