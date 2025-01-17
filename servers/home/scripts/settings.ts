import {BuiltinServer, GoFaction} from "@lib/enum_and_limiter_definitions";
import type * as SettingsClasses  from "@lib/settings_classes";

export const Run: SettingsClasses.RunSettings = {
  x: 1500,
  y: 15,
  width: 200,
  height: 200,
  tailTitle: "Run Menu",
  // Negated lookahead match, so we can still invoke `exploits` to reload the objects
  exclusionPattern: /solvers\/|lib\/(?!exploits)|Temp\/|gangs\/|logs\//,
};
export const ContractDispatcher: SettingsClasses.SettingsData = {
  x: 1300,
  y: 50,
  width: 400,
  height: 200,
  tailTitle: "Contract Dispatcher",
};
export const Contracts: SettingsClasses.SettingsData = {
  x: 1300,
  y: 85,
  width: 400,
  height: 200,
  tailTitle: "Contract Scanner",
};
export const ContractCalc: SettingsClasses.SettingsData = {
  x: 1300,
  y: 120,
  width: 400,
  height: 300,
  tailTitle: "Contract Calc",
};
export const Augments: SettingsClasses.AugmentsSettings = {
  x: 1300,
  y: 155,
  width: 400,
  height: 200,
  tailTitle: "Augments",
  repMargin: 0.9,
  mode: "uniques",
};
// noinspection ConfusingFloatingPointLiteralJS
export const GangLord: SettingsClasses.GangSettings = {
  x: 1300,
  y: 190,
  width: 400,
  height: 200,
  tailTitle: "Gang Lord",
  maxRep: 1e7, // 10 million
  mode: "cash",
  wantedPenaltyThreshold: 0.90,
  territoryWarfareThreshold: 0.60,
  memberWarfareThreshold: 600,
  memberMinTraining: 100,
  targetFactionRep: 2.5e6, // Barring any multipliers, this SHOULD be the most required for augments
  targetGangRespect: 2e6, // Even this is probably more than enough; after that point, even focusing on cash still brings rep
  vigilanteRespectThreshold: 10,
  purchaseThreshold: 10,
};
export const Scratchpad: SettingsClasses.SettingsData = {
  x: 1300,
  y: 225,
  width: 400,
  height: 200,
  tailTitle: "Scratchpad",
};
export const Go: SettingsClasses.GoSettings = {
  x: 1500,
  y: 190,
  width: 200,
  height: 200,
  tailTitle: "IPvGo AI",
  keepPlaying: true,
  loopDelay: 100,
  faction: GoFaction.Daedalus,
  boardSize: 7,
};
export const NetTree: SettingsClasses.SettingsData = {
  x: 1375,
  y: 610,
  width: 525,
  height: 365,
  tailTitle: "Net Tree",
};
// noinspection ConfusingFloatingPointLiteralJS
export const HacknetManager: SettingsClasses.HacknetSettings = {
  x: 1500,
  y: 750,
  width: 400,
  height: 200,
  tailTitle: "Hacknet Manager",
  maxPrice: 1e6,
  loopDelay: 10 * 1000,
  threshold: 1000,
};
// noinspection SpellCheckingInspection - In-game servers trigger this inspection...
export const Deploy: SettingsClasses.DeploySettings = {
  x: 1500,
  y: 785,
  width: 400,
  height: 200,
  tailTitle: "Deploy Orchestrator",
  mode: "hgw",
  resetScripts: true,
  dynamicTarget: true,
  targetSelf: false,
  targetServer: BuiltinServer["joesguns"],
  loopDelay: 15 * 1000,
  ramCapacity: 2048,
  purchaseThreshold: 100,
  // Adjust per-run; previously used 5, 3, 2, 0, 3
  // Can be at most 25 total
  shareCount: 5,
  weakenCount: 5,
  growCount: 2,
  prepCount: 5,
  clusterCount: 3,
  homeReservedRam: 64,
  hackTheWorld: false,
};

// noinspection SpellCheckingInspection - In-game servers have irregular names
export const ServerSelections: {
  alwaysBackdoor: (keyof typeof BuiltinServer)[];
  factionsBackdoor: (keyof typeof BuiltinServer)[];
  goodTargets: (keyof typeof BuiltinServer)[];
  classesBackdoor: (keyof typeof BuiltinServer)[];
  companyBackdoor: (keyof typeof BuiltinServer)[]
} = {
  alwaysBackdoor: [
    "w0r1d_d43m0n", // Control via Deploy.hackTheWorld
  ],
  factionsBackdoor: [
    // Special servers (core factions, etc.)
    "CSEC",         // CyberSec
    "avmnite-02h",  // NiteSec
    "I.I.I.I",      // The Black Hand
    "run4theh111z", // BitRunners
    ".",            // The Dark Army
    "The-Cave",     // Daedalus
  ],
  goodTargets: [
    "joesguns",     // Apparently can be `grow`-farmed for exp?
    "phantasy",
    "rho-construction",
  ],
  // Get a 10% discount if a venue is backdoored
  classesBackdoor: [
    // --Sector 12--
    //'iron-gym',           // Gym - 1x cost,  1x exp
    "powerhouse-fitness",   // Gym - 20x cost, 10x exp
    //'rothman-uni',        // Uni - 3x cost,  2x exp
    // --Aevum--
    //'crush-fitness',      // Gym - 3x cost,  2x exp
    //'snap-fitness',       // Gym - 10x cost, 5x exp
    //'summit-uni',         // Uni - 4x cost,  3x exp
    // --Volhaven--
    //'millenium-fitness',  // Gym - 7x cost,  4x exp
    "zb-institute",         // Uni - 5x cost,  4x exp
  ],
  // Get a reduced rep threshold to join a company's faction and get promotions
  companyBackdoor: [
    "b-and-a",
    "blade",
    "clarkinc",
    "ecorp",
    "fulcrumassets", // Fulcrum Secret Technologies
    "fulcrumtech",
    "kuai-gong",
    "megacorp",
    "nwo",
    "omnitek",
  ],
};

export const BackdoorConcat: string[] =
  ServerSelections.alwaysBackdoor.concat(
    ServerSelections.factionsBackdoor,
    ServerSelections.classesBackdoor,
    ServerSelections.goodTargets,
    ServerSelections.companyBackdoor,
  );

// MEMO Yes, this arguably should be in `tail_helpers.ts`; however, most programs already import this, but not that
//  Yes, this is weak justification.  Shush.
// This should be fine, since ESBuild includes imported code into the output file
export function setTailWindow(ns: NS, config: SettingsClasses.SettingsData, clearLog: boolean = true): void {
  ns.tail();

  if (clearLog) {
    ns.clearLog();
  }

  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  if (config.tailTitle !== undefined && config.tailTitle.length !== 0) {
    ns.setTitle(config.tailTitle);
  }
}
