'use strict';

var node_fs = require('node:fs');
var geoip2Node = require('@maxmind/geoip2-node');
var utils = require('./utils.cjs');

const dbBuffer = node_fs.readFileSync(utils.resolve("./db/GeoLite2-Country.mmdb"));
const dbReader = geoip2Node.Reader.openBuffer(dbBuffer);
async function getCountry(request) {
    const prisma = utils.prismaClient();
    let country;
    try {
        country = dbReader.country(request.ips?.[0] || request.ip).country?.isoCode;
    }
    catch (error) { }
    if (!country) {
        let al = request.headers["accept-language"];
        const region = utils.parseAcceptLanguage(Array.isArray(al) ? al[0] : al)[0]
            ?.region;
        if (region &&
            (await prisma.countries.findUnique({
                where: {
                    ISO: region.toUpperCase(),
                },
            }))) {
            country = region;
        }
    }
    return country;
}
async function getContinent(country) {
    const prisma = utils.prismaClient();
    country = country.toUpperCase();
    const { Continent } = (await prisma.countries.findUnique({
        where: {
            ISO: country,
        },
    })) ?? {};
    return Continent;
}
function country2region(country) {
    return country;
}

exports.country2region = country2region;
exports.getContinent = getContinent;
exports.getCountry = getCountry;
