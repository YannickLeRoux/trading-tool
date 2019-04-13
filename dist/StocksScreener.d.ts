export interface IStockScreener {
    universe: string[];
    dailyData: {
        stocks: [];
    };
}
export interface IDay {
    close: number;
    open: number;
}
