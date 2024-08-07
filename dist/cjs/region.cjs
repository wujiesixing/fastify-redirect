'use strict';

var node_fs = require('node:fs');
var geoip2Node = require('@maxmind/geoip2-node');
var countries = require('./countries.json.cjs');
var utils = require('./utils.cjs');

const dbBuffer = node_fs.readFileSync(utils.resolve("./db/GeoLite2-Country.mmdb"));
const dbReader = geoip2Node.Reader.openBuffer(dbBuffer);
function getCountry(request) {
    let country;
    try {
        country = dbReader.country(request.ips?.[0] || request.ip).country?.isoCode;
    }
    catch (error) { }
    if (!country) {
        let al = request.headers["accept-language"];
        const region = utils.parseAcceptLanguage(Array.isArray(al) ? al[0] : al)[0]
            ?.region;
        if (region && countries.default[region.toUpperCase()]) {
            country = region;
        }
    }
    return country;
}
function getContinent(country) {
    country = country.toUpperCase();
    const { Continent } = countries.default[country] ?? {};
    return Continent ?? undefined;
}
function country2region(country) {
    return country;
}

exports.country2region = country2region;
exports.getContinent = getContinent;
exports.getCountry = getCountry;
