import type { FastifyRequest } from "fastify";
export declare function getCountry(request: FastifyRequest): Promise<string | undefined>;
export declare function getContinent(country: string): Promise<string | undefined>;
export declare function country2region(country: string): string;
