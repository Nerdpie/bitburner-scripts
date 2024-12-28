import { AugmentationName, CompletedProgramName, FactionName } from "@enums";
import { Multipliers } from "../PersonObjects/Multipliers";
export interface AugmentationCosts {
    moneyCost: number;
    repCost: number;
}
export interface AugmentationCtorParams {
    info: string;
    stats?: string;
    isSpecial?: boolean;
    moneyCost: number;
    name: AugmentationName;
    prereqs?: AugmentationName[];
    repCost: number;
    factions: FactionName[];
    hacking?: number;
    strength?: number;
    defense?: number;
    dexterity?: number;
    agility?: number;
    charisma?: number;
    hacking_exp?: number;
    strength_exp?: number;
    defense_exp?: number;
    dexterity_exp?: number;
    agility_exp?: number;
    charisma_exp?: number;
    hacking_chance?: number;
    hacking_speed?: number;
    hacking_money?: number;
    hacking_grow?: number;
    company_rep?: number;
    faction_rep?: number;
    crime_money?: number;
    crime_success?: number;
    work_money?: number;
    hacknet_node_money?: number;
    hacknet_node_purchase_cost?: number;
    hacknet_node_ram_cost?: number;
    hacknet_node_core_cost?: number;
    hacknet_node_level_cost?: number;
    bladeburner_max_stamina?: number;
    bladeburner_stamina_gain?: number;
    bladeburner_analysis?: number;
    bladeburner_success_chance?: number;
    startingMoney?: number;
    programs?: CompletedProgramName[];
}
export declare class Augmentation {
    baseCost: number;
    baseRepRequirement: number;
    info: string;
    stats: string;
    isSpecial: boolean;
    name: AugmentationName;
    prereqs: AugmentationName[];
    mults: Multipliers;
    startingMoney: number;
    programs: CompletedProgramName[];
    factions: FactionName[];
    constructor(params: AugmentationCtorParams);
    /** Get the current level of an augmentation before buying. Currently only relevant for NFG. */
    getLevel(): number;
    /** Get the next level of an augmentation to buy. Currently only relevant for NFG. */
    getNextLevel(): number;
}
