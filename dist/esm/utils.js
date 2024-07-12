import { dirname, resolve as resolve$1 } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function resolve(...args) {
    return resolve$1(__dirname, ...args);
}
let prisma;
function prismaClient() {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
}
async function prismaDisconnect() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = undefined;
    }
}

export { parseAcceptLanguage, prismaClient, prismaDisconnect, resolve };
