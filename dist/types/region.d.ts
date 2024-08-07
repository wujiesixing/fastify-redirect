import type { FastifyRequest } from "fastify";
export declare function getCountry(request: FastifyRequest): string | undefined;
export declare function getContinent(country: string): string;
export declare function country2region(country: string): string;
