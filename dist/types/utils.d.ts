interface AcceptLanguage {
    language: string;
    script: string | null;
    region: string | null;
    quality: number;
}
export declare function parseAcceptLanguage(al?: string): AcceptLanguage[];
export declare function findRootDir(dir?: string): string;
export declare const __rootdir: string;
export declare function resolve(...args: string[]): string;
export {};
