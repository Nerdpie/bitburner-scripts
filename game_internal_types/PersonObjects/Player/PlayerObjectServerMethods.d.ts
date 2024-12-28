import { Server } from "../../Server/Server";
import { BaseServer } from "../../Server/BaseServer";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import type { PlayerObject } from "./PlayerObject";
export declare function hasTorRouter(this: PlayerObject): boolean;
export declare function getCurrentServer(this: PlayerObject): BaseServer;
export declare function getHomeComputer(this: PlayerObject): Server;
export declare function getUpgradeHomeRamCost(this: PlayerObject): number;
export declare function getUpgradeHomeCoresCost(this: PlayerObject): number;
export declare function createHacknetServer(this: PlayerObject): HacknetServer;
