import { Work } from "../../Work/Work";
import type { PlayerObject } from "./PlayerObject";
export declare function startWork(this: PlayerObject, w: Work): void;
export declare function processWork(this: PlayerObject, cycles?: number): void;
export declare function finishWork(this: PlayerObject, cancelled: boolean, suppressDialog?: boolean): void;
