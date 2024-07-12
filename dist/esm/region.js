import { readFileSync } from 'node:fs';
import { Reader } from '@maxmind/geoip2-node';
import { resolve, prismaClient, parseAcceptLanguage } from './utils.js';

const dbBuffer = readFileSync(resolve("./db/GeoLite2-Country.mmdb"));
const dbReader = Reader.openBuffer(dbBuffer);
async function getCountry(request) {
    const prisma = prismaClient();
    let country;
    try {
        country = dbReader.country(request.ips?.[0] || request.ip).country?.isoCode;
    }
    catch (error) { }
    if (!country) {
        let al = request.headers["accept-language"];
        const region = parseAcceptLanguage(Array.isArray(al) ? al[0] : al)[0]
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
    const prisma = prismaClient();
    country = country.toUpperCase();
    const { Continent } = (await prisma.countries.findUnique({
        where: {
            ISO: country,
        },
    })) ?? {};
    return Continent ?? undefined;
}
function country2region(country) {
    return country;
}

export { country2region, getContinent, getCountry };
