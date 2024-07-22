import { PrismaClient } from "@prisma/client";
interface AcceptLanguage {
    language: string;
    script: string | null;
    region: string;
    quality: number;
}
export declare function parseAcceptLanguage(al?: string): AcceptLanguage[];
export declare function findRootDir(dir?: string): string;
export declare const __rootdir: string;
export declare function resolve(...args: string[]): string;
export declare function prismaClient(): PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function prismaDisconnect(): Promise<void>;
export {};
