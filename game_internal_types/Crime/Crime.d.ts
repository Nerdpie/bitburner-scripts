import { Person as IPerson } from "@nsdefs";
import { WorkerScript } from "../Netscript/WorkerScript";
import { CrimeType } from "@/game_internal_types/Enums";
interface IConstructorParams {
    hacking_success_weight?: number;
    strength_success_weight?: number;
    defense_success_weight?: number;
    dexterity_success_weight?: number;
    agility_success_weight?: number;
    charisma_success_weight?: number;
    hacking_exp?: number;
    strength_exp?: number;
    defense_exp?: number;
    dexterity_exp?: number;
    agility_exp?: number;
    charisma_exp?: number;
    intelligence_exp?: number;
    kills?: number;
}
export declare class Crime {
    type: CrimeType;
    difficulty: number;
    karma: number;
    kills: number;
    money: number;
    workName: string;
    tooltipText: string;
    time: number;
    hacking_success_weight: number;
    strength_success_weight: number;
    defense_success_weight: number;
    dexterity_success_weight: number;
    agility_success_weight: number;
    charisma_success_weight: number;
    hacking_exp: number;
    strength_exp: number;
    defense_exp: number;
    dexterity_exp: number;
    agility_exp: number;
    charisma_exp: number;
    intelligence_exp: number;
    constructor(workName: string, tooltipText: string, type: CrimeType, time: number, money: number, difficulty: number, karma: number, params: IConstructorParams);
    commit(div?: number, workerScript?: WorkerScript | null): number;
    successRate(p: IPerson): number;
}
export {};
