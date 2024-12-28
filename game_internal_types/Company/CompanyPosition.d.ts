import { Person as IPerson } from "@nsdefs";
import { JobName, JobField } from "@/game_internal_types/Enums";
import type { Skills } from "../PersonObjects/Skills";
export interface CompanyPositionCtorParams {
    nextPosition: JobName | null;
    field: JobField;
    baseSalary: number;
    repMultiplier: number;
    applyText?: string;
    hiredText?: string;
    isPartTime?: boolean;
    reqdHacking?: number;
    reqdStrength?: number;
    reqdDefense?: number;
    reqdDexterity?: number;
    reqdAgility?: number;
    reqdCharisma?: number;
    reqdReputation?: number;
    hackingEffectiveness?: number;
    strengthEffectiveness?: number;
    defenseEffectiveness?: number;
    dexterityEffectiveness?: number;
    agilityEffectiveness?: number;
    charismaEffectiveness?: number;
    hackingExpGain?: number;
    strengthExpGain?: number;
    defenseExpGain?: number;
    dexterityExpGain?: number;
    agilityExpGain?: number;
    charismaExpGain?: number;
}
export declare class CompanyPosition {
    /** Position title */
    name: JobName;
    /** Field type of the position (software, it, business, etc) */
    field: JobField;
    /** Title of next position to be promoted to */
    nextPosition: JobName | null;
    /**
     * Base salary for this position ($ per 200ms game cycle)
     * Will be multiplier by a company-specific multiplier for final salary
     */
    baseSalary: number;
    /** Reputation multiplier */
    repMultiplier: number;
    /** Text to display when applying for this job */
    applyText: string;
    /** Text to display when receiving this job */
    hiredText: string;
    /** Whether this position is part-time */
    isPartTime: boolean;
    /** Required stats to earn this position */
    requiredAgility: number;
    requiredCharisma: number;
    requiredDefense: number;
    requiredDexterity: number;
    requiredHacking: number;
    requiredStrength: number;
    /** Required company reputation to earn this position */
    requiredReputation: number;
    /** Effectiveness of each stat time for job performance */
    hackingEffectiveness: number;
    strengthEffectiveness: number;
    defenseEffectiveness: number;
    dexterityEffectiveness: number;
    agilityEffectiveness: number;
    charismaEffectiveness: number;
    /** Experience gain for performing job (per 200ms game cycle) */
    hackingExpGain: number;
    strengthExpGain: number;
    defenseExpGain: number;
    dexterityExpGain: number;
    agilityExpGain: number;
    charismaExpGain: number;
    constructor(name: JobName, p: CompanyPositionCtorParams);
    requiredSkills(jobStatReqOffset: number): Skills;
    calculateJobPerformance(worker: IPerson): number;
}
