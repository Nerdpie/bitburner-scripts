import React from "react";
import { BaseServer } from "../Server/BaseServer";
export declare class Output {
    text: string;
    color: "primary" | "error" | "success" | "info" | "warn";
    constructor(text: string, color: "primary" | "error" | "success" | "info" | "warn");
}
export declare class RawOutput {
    raw: React.ReactNode;
    constructor(node: React.ReactNode);
}
export declare class Link {
    hostname: string;
    dashes: string;
    constructor(dashes: string, hostname: string);
}
export declare class TTimer {
    time: number;
    timeLeft: number;
    action: "h" | "b" | "a" | "g" | "w";
    server?: BaseServer;
    constructor(time: number, action: "h" | "b" | "a" | "g" | "w", server?: BaseServer);
}
