'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var plugin = require('./plugin.cjs');
var region = require('./region.cjs');
var utils = require('./utils.cjs');



exports.default = plugin.default;
exports.getContinent = region.getContinent;
exports.getCountry = region.getCountry;
exports.parseAcceptLanguage = utils.parseAcceptLanguage;
