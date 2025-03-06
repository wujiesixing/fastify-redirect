import { readFileSync } from "node:fs";

import { Reader } from "@maxmind/geoip2-node";

import countries from "./countries.json";
import { parseAcceptLanguage, resolve } from "./utils";

import type { FastifyRequest } from "fastify";

const dbBuffer = readFileSync(resolve("./db/GeoLite2-Country.mmdb"));
const dbReader = Reader.openBuffer(dbBuffer);

export function getCountry(request: FastifyRequest) {
  let country;

  try {
    country = dbReader.country(request.ips?.[0] || request.ip).country?.isoCode;
  } catch (error) {}

  if (!country) {
    let al = request.headers["accept-language"];

    const region = parseAcceptLanguage(Array.isArray(al) ? al[0] : al)[0]
      ?.region;

    if (region && countries[region as "AD"]) {
      country = region;
    }
  }

  return country;
}

export function getContinent(country: string) {
  country = country.toUpperCase();

  const { Continent } = countries[country as "AD"] ?? {};

  return Continent ?? undefined;
}

export function country2region(country: string) {
  return country;
}
