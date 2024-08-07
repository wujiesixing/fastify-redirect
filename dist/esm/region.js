import { readFileSync } from 'node:fs';
import { Reader } from '@maxmind/geoip2-node';
import countries from './countries.json.js';
import { resolve, parseAcceptLanguage } from './utils.js';

const dbBuffer = readFileSync(resolve("./db/GeoLite2-Country.mmdb"));
const dbReader = Reader.openBuffer(dbBuffer);
function getCountry(request) {
    let country;
    try {
        country = dbReader.country(request.ips?.[0] || request.ip).country?.isoCode;
    }
    catch (error) { }
    if (!country) {
        let al = request.headers["accept-language"];
        const region = parseAcceptLanguage(Array.isArray(al) ? al[0] : al)[0]
            ?.region;
        if (region && countries[region.toUpperCase()]) {
            country = region;
        }
    }
    return country;
}
function getContinent(country) {
    country = country.toUpperCase();
    const { Continent } = countries[country] ?? {};
    return Continent ?? undefined;
}
function country2region(country) {
    return country;
}

export { country2region, getContinent, getCountry };
