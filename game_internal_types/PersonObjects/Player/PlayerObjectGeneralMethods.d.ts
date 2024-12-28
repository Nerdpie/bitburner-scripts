import { AugmentationName, CompanyName, CompletedProgramName, FactionName, JobName, LocationName } from "@/game_internal_types/Enums";
import type { PlayerObject } from "./PlayerObject";
import type { ProgramFilePath } from "../../Paths/ProgramFilePath";
import { ICodingContractReward } from "../../CodingContracts";
import { Company } from "../../Company/Company";
import { CompanyPosition } from "../../Company/CompanyPosition";
import { Exploit } from "../../Exploits/Exploit";
import { Faction } from "../../Faction/Faction";
import { ISkillProgress } from "../formulas/skill";
import { MoneySource } from "../../utils/MoneySourceTracker";
export declare function init(this: PlayerObject): void;
export declare function prestigeAugmentation(this: PlayerObject): void;
export declare function prestigeSourceFile(this: PlayerObject): void;
export declare function receiveInvite(this: PlayerObject, factionName: FactionName): void;
export declare function receiveRumor(this: PlayerObject, factionName: FactionName): void;
export declare function calculateSkillProgress(this: PlayerObject, exp: number, mult?: number): ISkillProgress;
export declare function hasProgram(this: PlayerObject, programName: CompletedProgramName | ProgramFilePath): boolean;
export declare function setMoney(this: PlayerObject, money: number): void;
export declare function gainMoney(this: PlayerObject, money: number, source: MoneySource): void;
export declare function loseMoney(this: PlayerObject, money: number, source: MoneySource): void;
export declare function canAfford(this: PlayerObject, cost: number): boolean;
export declare function recordMoneySource(this: PlayerObject, amt: number, source: MoneySource): void;
export declare function startFocusing(this: PlayerObject): void;
export declare function stopFocusing(this: PlayerObject): void;
export declare function takeDamage(this: PlayerObject, amt: number): boolean;
export declare function hospitalize(this: PlayerObject, suppressNotification: boolean): number;
/**
 * Company job application. Determines the job that the Player should get (if any) at the given company.
 * @param this The player instance
 * @param company The company being applied to
 * @param position A specific position
 * @param sing Whether this is being called from the applyToCompany() Netscript Singularity function
 * @returns The name of the Job received (if any). May be higher or lower than the job applied to.
 */
export declare function applyForJob(this: PlayerObject, company: Company, position: CompanyPosition, sing?: boolean): JobName | null;
/**
 * Get a job position that the player can apply for.
 * @param this The player instance
 * @param company The Company being applied to
 * @param entryPosType Job field (Software, Business, etc)
 * @returns The highest job the player can apply for at this company, if any
 */
export declare function getNextCompanyPosition(this: PlayerObject, company: Company, entryPosType: CompanyPosition): CompanyPosition | null;
export declare function quitJob(this: PlayerObject, company: CompanyName, suppressDialog?: boolean): void;
/**
 * Method to see if the player has at least one job assigned to them
 * @param this The player instance
 * @returns Whether the user has at least one job
 */
export declare function hasJob(this: PlayerObject): boolean;
export declare function isQualified(this: PlayerObject, company: Company, position: CompanyPosition): boolean;
/********** Reapplying Augmentations and Source File ***********/
export declare function reapplyAllAugmentations(this: PlayerObject, resetMultipliers?: boolean): void;
export declare function reapplyAllSourceFiles(this: PlayerObject): void;
/**
 * Checks whether a player meets the requirements for joining each faction, and returns an array of all invitations the player should receive.
 * Also handles receiving rumors for factions if the rumor requirements are met.
 */
export declare function checkForFactionInvitations(this: PlayerObject): Faction[];
/************* BitNodes **************/
export declare function setBitNodeNumber(this: PlayerObject, n: number): void;
export declare function queueAugmentation(this: PlayerObject, name: AugmentationName): void;
/************* Coding Contracts **************/
export declare function gainCodingContractReward(this: PlayerObject, reward: ICodingContractReward | null, difficulty?: number): string;
export declare function gotoLocation(this: PlayerObject, to: LocationName): boolean;
export declare function canAccessGrafting(this: PlayerObject): boolean;
export declare function giveExploit(this: PlayerObject, exploit: Exploit): void;
export declare function giveAchievement(this: PlayerObject, achievementId: string): void;
export declare function getCasinoWinnings(this: PlayerObject): number;
export declare function canAccessCotMG(this: PlayerObject): boolean;
export declare function sourceFileLvl(this: PlayerObject, n: number): number;
export declare function activeSourceFileLvl(this: PlayerObject, n: number): number;
export declare function focusPenalty(this: PlayerObject): number;
