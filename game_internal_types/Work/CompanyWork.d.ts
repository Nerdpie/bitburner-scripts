import { IReviverValue } from "../utils/JSONReviver";
import { Work, WorkType } from "./Work";
import { CompanyName, JobName } from "@/game_internal_types/Enums";
import { WorkStats } from "./WorkStats";
import { Company } from "../Company/Company";
interface CompanyWorkParams {
    companyName: CompanyName;
    singularity: boolean;
}
export declare const isCompanyWork: (w: Work | null) => w is CompanyWork;
export declare class CompanyWork extends Work {
    companyName: CompanyName;
    constructor(params?: CompanyWorkParams);
    getCompany(): Company;
    getGainRates(job: JobName): WorkStats;
    process(cycles: number): boolean;
    finish(cancelled: boolean, suppressDialog?: boolean): void;
    APICopy(): {
        type: WorkType.COMPANY;
        cyclesWorked: number;
        companyName: CompanyName;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a CompanyWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): CompanyWork;
}
export {};
