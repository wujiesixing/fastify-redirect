'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var plugin$1 = require('fastify-plugin');
var region = require('./region.cjs');

var plugin = plugin$1(async function (fastify, options) {
    fastify.addHook("onRequest", async (request, reply) => {
        const { url } = request;
        if (fastify.hasRoute({
            url: url,
            method: request.method,
        }) ||
            options.ignore?.some((i) => {
                if (typeof i === "string") {
                    return url.startsWith(i);
                }
                return i.test(url);
            })) {
            return;
        }
        const matches = url.match(/^\/+([^\/?#]+)/);
        if (matches) {
            const firstPath = matches[1]?.toLowerCase();
            if (options.regions.includes(firstPath)) {
                return;
            }
        }
        let { country, region: region$1 } = request.cookies;
        if (region$1) {
            region$1 = region$1.toLowerCase();
            if (options.regions.includes(region$1)) {
                reply.code(302).redirect(`/${region$1}${url}`);
                return;
            }
        }
        let isRegionOk = false;
        if (!country) {
            country = region.getCountry(request);
            if (country) {
                reply.setCookie("country", country, {
                    domain: options.domain,
                    maxAge: 30 * 24 * 60 * 60,
                    httpOnly: true,
                });
            }
        }
        if (country) {
            region$1 = options.country2region
                ? await options.country2region(country)
                : region.country2region(country);
            if (region$1) {
                region$1 = region$1.toLowerCase();
            }
            if (!options.regions.includes(region$1)) {
                region$1 = undefined;
            }
            if (region$1) {
                isRegionOk = true;
                // 如果是客户端用户选择的地区，则永不过期
                reply.setCookie("region", region$1, {
                    domain: options.domain,
                });
            }
        }
        if (!isRegionOk) {
            reply.clearCookie("region");
        }
        reply.code(302).redirect(`/${region$1 || options.fallbackRegion}${url}`);
    });
}, {
    name: "fastify-redirect",
    dependencies: ["@fastify/cookie"],
});

exports.default = plugin;
