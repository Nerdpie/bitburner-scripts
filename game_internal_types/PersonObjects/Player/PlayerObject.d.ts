import type { BitNodeOptions, Player as IPlayer } from "@nsdefs";
import type { PlayerAchievement } from "../../Achievements/Achievements";
import type { Bladeburner } from "../../Bladeburner/Bladeburner";
import type { Corporation } from "../../Corporation/Corporation";
import type { Exploit } from "../../Exploits/Exploit";
import type { Gang } from "../../Gang/Gang";
import type { HacknetNode } from "../../Hacknet/HacknetNode";
import type { Sleeve } from "../Sleeve/Sleeve";
import type { Work } from "../../Work/Work";
import * as augmentationMethods from "./PlayerObjectAugmentationMethods";
import * as bladeburnerMethods from "./PlayerObjectBladeburnerMethods";
import * as corporationMethods from "./PlayerObjectCorporationMethods";
import * as gangMethods from "./PlayerObjectGangMethods";
import * as generalMethods from "./PlayerObjectGeneralMethods";
import * as serverMethods from "./PlayerObjectServerMethods";
import * as workMethods from "./PlayerObjectWorkMethods";
import { CompanyName, FactionName, JobName } from "@/game_internal_types/Enums";
import { HashManager } from "../../Hacknet/HashManager";
import { type MoneySource, MoneySourceTracker } from "../../utils/MoneySourceTracker";
import { IReviverValue } from "../../utils/JSONReviver";
import { JSONMap, JSONSet } from "../../Types/Jsonable";
import { Person } from "../Person";
import { PartialRecord } from "../../Types/Record";
export declare class PlayerObject extends Person implements IPlayer {
    bitNodeN: number;
    corporation: Corporation | null;
    gang: Gang | null;
    bladeburner: Bladeburner | null;
    currentServer: string;
    factions: FactionName[];
    factionInvitations: FactionName[];
    factionRumors: JSONSet<FactionName>;
    hacknetNodes: (HacknetNode | string)[];
    has4SData: boolean;
    has4SDataTixApi: boolean;
    hashManager: HashManager;
    hasTixApiAccess: boolean;
    hasWseAccount: boolean;
    jobs: PartialRecord<CompanyName, JobName>;
    karma: number;
    numPeopleKilled: number;
    location: any;
    money: number;
    moneySourceA: MoneySourceTracker;
    moneySourceB: MoneySourceTracker;
    playtimeSinceLastAug: number;
    playtimeSinceLastBitnode: number;
    lastAugReset: number;
    lastNodeReset: number;
    purchasedServers: string[];
    scriptProdSinceLastAug: number;
    sleeves: Sleeve[];
    sleevesFromCovenant: number;
    sourceFiles: JSONMap<number, number>;
    exploits: Exploit[];
    achievements: PlayerAchievement[];
    terminalCommandHistory: string[];
    identifier: string;
    lastUpdate: number;
    lastSave: number;
    totalPlaytime: number;
    currentWork: Work | null;
    focus: boolean;
    entropy: number;
    bitNodeOptions: BitNodeOptions;
    get activeSourceFiles(): JSONMap<number, number>;
    init: typeof generalMethods.init;
    startWork: typeof workMethods.startWork;
    processWork: typeof workMethods.processWork;
    finishWork: typeof workMethods.finishWork;
    applyForJob: typeof generalMethods.applyForJob;
    canAccessBladeburner: typeof bladeburnerMethods.canAccessBladeburner;
    canAccessCorporation: typeof corporationMethods.canAccessCorporation;
    canAccessGang: typeof gangMethods.canAccessGang;
    canAccessGrafting: typeof generalMethods.canAccessGrafting;
    canAfford: typeof generalMethods.canAfford;
    gainMoney: typeof generalMethods.gainMoney;
    getCurrentServer: typeof serverMethods.getCurrentServer;
    getGangFaction: typeof gangMethods.getGangFaction;
    getGangName: typeof gangMethods.getGangName;
    getHomeComputer: typeof serverMethods.getHomeComputer;
    getNextCompanyPosition: typeof generalMethods.getNextCompanyPosition;
    getUpgradeHomeRamCost: typeof serverMethods.getUpgradeHomeRamCost;
    getUpgradeHomeCoresCost: typeof serverMethods.getUpgradeHomeCoresCost;
    gotoLocation: typeof generalMethods.gotoLocation;
    hasGangWith: typeof gangMethods.hasGangWith;
    hasTorRouter: typeof serverMethods.hasTorRouter;
    hasProgram: typeof generalMethods.hasProgram;
    inGang: typeof gangMethods.inGang;
    isAwareOfGang: typeof gangMethods.isAwareOfGang;
    isQualified: typeof generalMethods.isQualified;
    loseMoney: typeof generalMethods.loseMoney;
    reapplyAllAugmentations: typeof generalMethods.reapplyAllAugmentations;
    reapplyAllSourceFiles: typeof generalMethods.reapplyAllSourceFiles;
    recordMoneySource: typeof generalMethods.recordMoneySource;
    setMoney: typeof generalMethods.setMoney;
    startBladeburner: typeof bladeburnerMethods.startBladeburner;
    startCorporation: typeof corporationMethods.startCorporation;
    startFocusing: typeof generalMethods.startFocusing;
    startGang: typeof gangMethods.startGang;
    takeDamage: typeof generalMethods.takeDamage;
    giveExploit: typeof generalMethods.giveExploit;
    giveAchievement: typeof generalMethods.giveAchievement;
    getCasinoWinnings: typeof generalMethods.getCasinoWinnings;
    quitJob: typeof generalMethods.quitJob;
    hasJob: typeof generalMethods.hasJob;
    createHacknetServer: typeof serverMethods.createHacknetServer;
    queueAugmentation: typeof generalMethods.queueAugmentation;
    receiveInvite: typeof generalMethods.receiveInvite;
    receiveRumor: typeof generalMethods.receiveRumor;
    gainCodingContractReward: typeof generalMethods.gainCodingContractReward;
    stopFocusing: typeof generalMethods.stopFocusing;
    prestigeAugmentation: typeof generalMethods.prestigeAugmentation;
    prestigeSourceFile: typeof generalMethods.prestigeSourceFile;
    calculateSkillProgress: typeof generalMethods.calculateSkillProgress;
    hospitalize: typeof generalMethods.hospitalize;
    checkForFactionInvitations: typeof generalMethods.checkForFactionInvitations;
    setBitNodeNumber: typeof generalMethods.setBitNodeNumber;
    canAccessCotMG: typeof generalMethods.canAccessCotMG;
    sourceFileLvl: typeof generalMethods.sourceFileLvl;
    activeSourceFileLvl: typeof generalMethods.activeSourceFileLvl;
    applyEntropy: typeof augmentationMethods.applyEntropy;
    focusPenalty: typeof generalMethods.focusPenalty;
    constructor();
    travelCostMoneySource(): MoneySource;
    whoAmI(): string;
    sleevesSupportingBladeburner(): Sleeve[];
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a PlayerObject object from a JSON save state. */
    static fromJSON(value: IReviverValue): PlayerObject;
}
