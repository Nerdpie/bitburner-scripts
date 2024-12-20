import * as SettingsClasses from '@/servers/home/scripts/lib/settings_classes'
import {BuiltinServers} from "@/servers/home/scripts/lib/builtin_servers";
import {GoFaction} from "@/servers/home/scripts/lib/enum_and_limiter_definitions";

export const ContractCalc: SettingsClasses.SettingsData = {
  x: 1250,
  y: 50,
  width: 450,
  height: 300,
  tailTitle: 'Contract Calc'
}
export const Scratchpad: SettingsClasses.SettingsData = {
  x: 1250,
  y: 85,
  width: 450,
  height: 200,
  tailTitle: 'Scratchpad'
}
export const ContractDispatcher: SettingsClasses.SettingsData = {
  x: 1250,
  y: 120,
  width: 450,
  height: 200,
  tailTitle: 'Contract Dispatcher'
}
export const Run: SettingsClasses.RunSettings = {
  x: 1500,
  y: 155,
  width: 200,
  height: 200,
  tailTitle: 'Run Menu',
  exclusionPattern: '(solvers|lib|Temp|gangs)/'
}
export const Go: SettingsClasses.GoSettings = {
  x: 1500,
  y: 190,
  width: 200,
  height: 200,
  tailTitle: 'IPvGo AI',
  keepPlaying: true,
  loopDelay: 100,
  faction: GoFaction.Daedalus,
  boardSize: 7
}
// noinspection ConfusingFloatingPointLiteralJS
export const GangLord: SettingsClasses.GangSettings = {
  // Stealing the spot from `Go` since we're using the script from Insight's repo
  x: 1500,
  y: 190,
  width: 200,
  height: 200,
  tailTitle: 'Gang Lord',
  maxRep: 1e7, // 10 million
  mode: 'rep',
  wantedPenaltyThreshold: 0.90,
  territoryWarfareThreshold: 0.60,
  memberWarfareThreshold: 600,
  memberMinTraining: 100,
  targetFactionRep: 2.5e6, // Barring any multipliers, this SHOULD be the most required for augments
  targetGangRespect: 20e6,
}
export const NetTree: SettingsClasses.SettingsData = {
  x: 1375,
  y: 575,
  width: 525,
  height: 400,
  tailTitle: 'Net Tree'
}
export const Contracts: SettingsClasses.SettingsData = {
  x: 1500,
  y: 610,
  width: 400,
  height: 200,
  tailTitle: 'Contract Scanner'
}
export const Augments: SettingsClasses.AugmentsSettings = {
  x: 1500,
  y: 645,
  width: 400,
  height: 200,
  tailTitle: 'Augments',
  mode: "uniques"
}
// noinspection ConfusingFloatingPointLiteralJS
export const HacknetManager: SettingsClasses.HacknetSettings = {
  x: 1500,
  y: 750,
  width: 400,
  height: 200,
  tailTitle: 'Hacknet Manager',
  maxPrice: 1e9,
  loopDelay: 10 * 1000,
  threshold: undefined
}
// noinspection SpellCheckingInspection - In-game servers trigger this inspection...
export const Deploy: SettingsClasses.DeploySettings = {
  x: 1500,
  y: 785,
  width: 400,
  height: 200,
  tailTitle: 'Deploy Orchestrator',
  mode: 'hgw',
  resetScripts: true,
  targetSelf: true,
  targetServer: BuiltinServers['4sigma'],
  loopDelay: 60 * 1000,
  ramCapacity: 16,
  // Adjust per-run; previously used 5, 3, 2, 3
  shareCount: 0,
  weakenCount: 0,
  growCount: 0,
  clusterCount: 0,
  homeReservedRam: 64,
}

// noinspection SpellCheckingInspection - In-game servers have irregular names
export const ServerSelections = {
  alwaysBackdoor: [
    // Special servers (core factions, etc.)
    'CSEC',         // CyberSec
    'avmnite-02h',  // NiteSec
    'I.I.I.I',      // The Black Hand
    'run4theh111z', // BitRunners
    '.',            // The Dark Army
    'The-Cave',     // Daedalus
    // 'w0r1d_d43m0n', // May not want to backdoor right away...
    // Good targets
    'n00dles',      // Stupid easy early-game target for basic cash
    'joesguns',     // Apparently can be `grow`-farmed for exp?
  ],
  // Get a 10% discount if a venue is backdoored
  classesBackdoor: [
    // --Sector 12--
    'iron-gym',             // Gym - 1x cost,  1x exp
    'powerhouse-fitness',   // Gym - 20x cost, 10x exp
    'rothman-uni',          // Uni - 3x cost,  2x exp
    // --Aevum--
    //'crush-fitness',      // Gym - 3x cost,  2x exp
    //'snap-fitness',       // Gym - 10x cost, 5x exp
    //'summit-uni',         // Uni - 4x cost,  3x exp
    // --Volhaven--
    //'millenium-fitness',  // Gym - 7x cost,  4x exp
    'zb-institute'          // Uni - 5x cost,  4x exp
  ],
  // Get a reduced rep threshold to join a company's faction and get promotions
  companyBackdoor: [
    'b-and-a',
    'blade',
    'clarkinc',
    'ecorp',
    'fulcrumassets', // Fulcrum Secret Technologies
    'fulcrumtech',
    'kuai-gong',
    'megacorp',
    'nwo',
    'omnitek'
  ],
}

export const BackdoorConcat: string[] =
  ServerSelections.alwaysBackdoor.concat(
    ServerSelections.classesBackdoor,
    ServerSelections.companyBackdoor);

// This should be fine, since ESBuild includes imported code into the output file
export function setTailWindow(ns: NS, config: SettingsClasses.SettingsData, clearLog: boolean = true): void {
  ns.tail();

  if (clearLog) {
    ns.clearLog();
  }

  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  if (config.tailTitle && config.tailTitle.length !== 0
  ) {
    ns.setTitle(config.tailTitle);
  }
}