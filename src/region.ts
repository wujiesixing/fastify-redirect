import { readFileSync } from "node:fs";

import { Reader } from "@maxmind/geoip2-node";

import { parseAcceptLanguage, prismaClient, resolve } from "./utils";

import type { FastifyRequest } from "fastify";

const dbBuffer = readFileSync(resolve("./db/GeoLite2-Country.mmdb"));
const dbReader = Reader.openBuffer(dbBuffer);

export async function getCountry(request: FastifyRequest) {
  const prisma = prismaClient();

  let country;

  try {
    country = dbReader.country(request.ips?.[0] || request.ip).country?.isoCode;
  } catch (error) {}

  if (!country) {
    let al = request.headers["accept-language"];

    const region = parseAcceptLanguage(Array.isArray(al) ? al[0] : al)[0]
      ?.region;

    if (
      region &&
      (await prisma.countries.findUnique({
        where: {
          ISO: region.toUpperCase(),
        },
      }))
    ) {
      country = region;
    }
  }

  return country;
}

export async function getContinent(country: string) {
  const prisma = prismaClient();

  country = country.toUpperCase();

  const { Continent } =
    (await prisma.countries.findUnique({
      where: {
        ISO: country,
      },
    })) ?? {};

  return Continent;
}

export function country2region(country: string) {
  return country;
}
