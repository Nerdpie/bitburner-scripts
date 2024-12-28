import type { IReviverValue } from "../utils/JSONReviver";
import type { Task } from "@nsdefs";
export declare abstract class Work {
    type: WorkType;
    singularity: boolean;
    cyclesWorked: number;
    constructor(type: WorkType, singularity: boolean);
    abstract process(cycles: number): boolean;
    abstract finish(cancelled: boolean, suppressDialog?: boolean): void;
    abstract APICopy(): Task;
    abstract toJSON(): IReviverValue;
}
export declare enum WorkType {
    CRIME = "CRIME",
    CLASS = "CLASS",
    CREATE_PROGRAM = "CREATE_PROGRAM",
    GRAFTING = "GRAFTING",
    FACTION = "FACTION",
    COMPANY = "COMPANY"
}
