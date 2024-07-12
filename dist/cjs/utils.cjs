'use strict';

var node_path = require('node:path');
var node_url = require('node:url');
var client = require('@prisma/client');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const acceptLanguageRegex = /((([a-zA-Z]+(-[a-zA-Z0-9]+){0,2})|\*)(;q=[0-1](\.[0-9]+)?)?)*/g;
function parseAcceptLanguage(al) {
    if (!al)
        return [];
    const strings = al.match(acceptLanguageRegex);
    if (!strings)
        return [];
    return strings
        .map(function (m) {
        if (!m)
            return;
        const bits = m.split(";");
        const ietf = bits[0].split("-");
        let script = null;
        let region = null;
        if (ietf.length === 2) {
            if (ietf[1].length === 2) {
                region = ietf[1];
            }
            else {
                script = ietf[1];
            }
        }
        if (ietf.length === 3) {
            script = ietf[1];
            region = ietf[2];
        }
        return {
            language: ietf[0],
            script,
            region,
            quality: bits[1] ? parseFloat(bits[1].split("=")[1]) : 1.0,
        };
    })
        .filter(function (r) {
        return !!r;
    })
        .sort(function (a, b) {
        return b.quality - a.quality;
    });
}
const __filename$1 = node_url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('cjs/utils.cjs', document.baseURI).href)));
const __dirname$1 = node_path.dirname(__filename$1);
function resolve(...args) {
    return node_path.resolve(__dirname$1, ...args);
}
let prisma;
function prismaClient() {
    if (!prisma) {
        prisma = new client.PrismaClient();
    }
    return prisma;
}
async function prismaDisconnect() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = undefined;
    }
}

exports.parseAcceptLanguage = parseAcceptLanguage;
exports.prismaClient = prismaClient;
exports.prismaDisconnect = prismaDisconnect;
exports.resolve = resolve;
