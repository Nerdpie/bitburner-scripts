export declare enum OrderType {
    LimitBuy = "Limit Buy Order",
    LimitSell = "Limit Sell Order",
    StopBuy = "Stop Buy Order",
    StopSell = "Stop Sell Order"
}
export declare enum PositionType {
    Long = "L",
    Short = "S"
}
export declare const StockSymbol: {
    readonly [x: number]: "ECP" | "MGCP" | "BLD" | "CLRK" | "OMTK" | "FSIG" | "KGI" | "FLCM" | "STM" | "DCOMM" | "HLS" | "VITA" | "ICRS" | "UNV" | "AERO" | "OMN" | "SLRS" | "GPH" | "NVMD" | "WDS" | "LXO" | "RHOC" | "APHE" | "SYSC" | "CTK" | "NTLK" | "OMGA" | "FNS" | "JGN";
    readonly "Sigma Cosmetics": "SGC";
    readonly "Catalyst Ventures": "CTYS";
    readonly "Microdyne Technologies": "MDYN";
    readonly "Titan Laboratories": "TITN";
};
export type StockSymbol = (typeof StockSymbol)[keyof typeof StockSymbol];
