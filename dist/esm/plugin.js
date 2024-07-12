import plugin$1 from 'fastify-plugin';
import { getCountry, country2region } from './region.js';
import { prismaDisconnect } from './utils.js';

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
        let { country, region } = request.cookies;
        if (region) {
            region = region.toLowerCase();
            if (options.regions.includes(region)) {
                reply.code(302).redirect(`/${region}${url}`);
                return;
            }
        }
        let isRegionOk = false;
        if (!country) {
            country = await getCountry(request);
            if (country) {
                reply.setCookie("country", country, {
                    domain: options.domain,
                    maxAge: 30 * 24 * 60 * 60,
                    httpOnly: true,
                });
            }
        }
        if (country) {
            region = options.country2region
                ? await options.country2region(country)
                : country2region(country);
            if (region) {
                region = region.toLowerCase();
            }
            if (!options.regions.includes(region)) {
                region = undefined;
            }
            if (region) {
                isRegionOk = true;
                // 如果是客户端用户选择的地区，则永不过期
                reply.setCookie("region", region, {
                    domain: options.domain,
                });
            }
        }
        if (!isRegionOk) {
            reply.clearCookie("region");
        }
        reply.code(302).redirect(`/${region || options.defaultRegion}${url}`);
    });
    fastify.addHook("onClose", async () => {
        await prismaDisconnect();
    });
}, {
    name: "fastify-redirect",
    dependencies: ["@fastify/cookie"],
});

export { plugin as default };
