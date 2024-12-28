import { CityName, LiteratureName, MessageFilename, CompanyName, JobName } from "@/game_internal_types/Enums";
import { ServerName } from "../Types/strings";
import type { PlayerObject } from "../PersonObjects/Player/PlayerObject";
import type { Skills } from "../PersonObjects/Skills";
import type { PlayerRequirement } from "@nsdefs";
/**
 * Declarative format for checking that the player satisfies some condition, such as the requirements for being invited to a faction.
 */
export interface PlayerCondition {
    toString(): string;
    toJSON(): PlayerRequirement;
    isSatisfied(p: PlayerObject): boolean;
}
export declare const haveBackdooredServer: (hostname: ServerName) => PlayerCondition;
export declare const employedBy: (companyName: CompanyName) => PlayerCondition;
export declare const haveCompanyRep: (companyName: CompanyName, rep: number) => PlayerCondition;
export declare const haveJobTitle: (jobTitle: JobName) => PlayerCondition;
export declare const executiveEmployee: () => PlayerCondition;
export declare const notEmployedBy: (companyName: CompanyName) => PlayerCondition;
export declare const haveAugmentations: (n: number) => PlayerCondition;
export declare const haveMoney: (n: number) => PlayerCondition;
export declare const haveSkill: (skill: keyof Skills, n: number) => PlayerCondition;
export declare const haveCombatSkills: (n: number) => CompoundPlayerCondition;
export declare const haveKarma: (n: number) => PlayerCondition;
export declare const haveKilledPeople: (n: number) => PlayerCondition;
export declare const locatedInCity: (city: CityName) => PlayerCondition;
export declare const locatedInSomeCity: (...cities: CityName[]) => PlayerCondition;
export declare const totalHacknetRam: (n: number) => PlayerCondition;
export declare const totalHacknetCores: (n: number) => PlayerCondition;
export declare const totalHacknetLevels: (n: number) => PlayerCondition;
export declare const haveBladeburnerRank: (n: number) => PlayerCondition;
export declare const inBitNode: (n: number) => PlayerCondition;
export declare const haveSourceFile: (n: number) => PlayerCondition;
export declare const haveSomeSourceFile: (...nodeNums: number[]) => PlayerCondition;
export declare const haveFile: (fileName: LiteratureName | MessageFilename) => PlayerCondition;
export interface CompoundPlayerCondition extends PlayerCondition, Iterable<PlayerCondition> {
    type: "someCondition" | "everyCondition";
    [Symbol.iterator]: () => IterableIterator<PlayerCondition>;
}
export declare const unsatisfiable: PlayerCondition;
export declare const notCondition: (condition: PlayerCondition) => PlayerCondition;
export declare const someCondition: (conditions: PlayerCondition[]) => CompoundPlayerCondition;
export declare const everyCondition: (conditions: PlayerCondition[]) => CompoundPlayerCondition;
export declare const delayedCondition: (arg: () => PlayerCondition) => PlayerCondition;
