interface AcceptLanguage {
    language: string;
    script: string | null;
    region: string;
    quality: number;
}
export declare function parseAcceptLanguage(al?: string): AcceptLanguage[];
export declare function resolve(...args: string[]): string;
export declare function prismaClient(): any;
export declare function prismaDisconnect(): Promise<void>;
export {};
