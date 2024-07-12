interface Options {
    regions: string[];
    defaultRegion: string;
    country2region?: (country: string) => Promise<string | undefined>;
    ignore?: Array<RegExp | string>;
    domain?: string;
}
declare const _default: (fastify: import("fastify").FastifyInstance<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>, options: Options) => Promise<void>;
export default _default;
