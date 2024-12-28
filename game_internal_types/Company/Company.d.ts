import type { CompanyPosition } from "./CompanyPosition";
import { CompanyName, JobName, FactionName } from "@/game_internal_types/Enums";
export interface CompanyCtorParams {
    name: CompanyName;
    info?: string;
    companyPositions: JobName[];
    expMultiplier: number;
    salaryMultiplier: number;
    jobStatReqOffset: number;
    relatedFaction?: FactionName | undefined;
}
export declare class Company {
    #private;
    name: any;
    info: string;
    relatedFaction: FactionName | undefined;
    companyPositions: Set<JobName>;
    /** Company-specific multiplier for earnings */
    expMultiplier: number;
    salaryMultiplier: number;
    /**
     * The additional levels of stats you need to quality for a job
     * in this company.
     *
     * For example, the base stat requirement for an intern position is 1.
     * But if a company has a offset of 200, then you would need stat(s) of 201
     */
    jobStatReqOffset: number;
    playerReputation: number;
    constructor(p: CompanyCtorParams);
    get favor(): number;
    /**
     * There is no setter for this.#favor. This is intentional. Performing arithmetic operations on `favor` may lead to
     * the overflow error of `playerReputation`, so anything that wants to change `favor` must explicitly do that through
     * `setFavor`.
     *
     * @param value
     */
    setFavor(value: number): void;
    hasPosition(pos: CompanyPosition | JobName): boolean;
    prestigeAugmentation(): void;
    prestigeSourceFile(): void;
}
