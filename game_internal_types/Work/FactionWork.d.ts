import type { Faction } from "../Faction/Faction";
import { Work, WorkType } from "./Work";
import { IReviverValue } from "../utils/JSONReviver";
import { FactionName, FactionWorkType } from "@/game_internal_types/Enums";
import { WorkStats } from "./WorkStats";
interface FactionWorkParams {
    singularity: boolean;
    factionWorkType: FactionWorkType;
    faction: FactionName;
}
export declare const isFactionWork: (w: Work | null) => w is FactionWork;
export declare class FactionWork extends Work {
    factionWorkType: FactionWorkType;
    factionName: FactionName;
    constructor(params?: FactionWorkParams);
    getFaction(): Faction;
    getReputationRate(): number;
    getExpRates(): WorkStats;
    process(cycles: number): boolean;
    finish(cancelled: boolean, suppressDialog?: boolean): void;
    APICopy(): {
        type: WorkType.FACTION;
        cyclesWorked: number;
        factionWorkType: FactionWorkType;
        factionName: FactionName;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a FactionWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): FactionWork;
}
export {};
