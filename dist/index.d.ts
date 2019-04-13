declare const universe: any;
declare const alpha: any;
declare const low: any;
declare const FileSync: any;
declare const StocksScreener: any;
declare const adapter: any;
declare const db: any;
declare function timeout(ms: number): Promise<{}>;
declare function sleep(fn: any, ...args: any[]): Promise<any>;
declare function populateDB(): Promise<void>;
declare function polishData(data: any): {
    [x: string]: any;
}[];
