// TODO Consider moving the default `tail` config block into a utility function
import {
  AugmentsSettings,
  DeploySettings,
  GoFaction,
  GoSettings,
  HacknetSettings,
  SettingsData
} from '@/servers/home/scripts/lib/settings_classes'
import {BuiltinServers} from "@/servers/home/scripts/lib/builtin_servers";

/*
 * Central settings for my scripts
 * @example
 * import { Deploy } from "servers/home/scripts/settings"
 *
 * ns.tail();
 * ns.clearLog();
 *
 * let config = Deploy;
 * ns.moveTail(config.x, config.y);
 * ns.resizeTail(config.width, config.height);
 */

export const ContractCalc: SettingsData = {
  x: 1250,
  y: 50,
  width: 500,
  height: 300
}
export const Scratchpad: SettingsData = {
  x: 1250,
  y: 85,
  width: 500,
  height: 200
}
export const Run: SettingsData = {
  x: 1500,
  y: 120,
  width: 200,
  height: 200
}
export const Go: GoSettings = {
  x: 1500,
  y: 155,
  width: 200,
  height: 200,
  keepPlaying: true,
  loopDelay: 100,
  faction: GoFaction.Daedalus,
  boardSize: 7
}
export const NetTree: SettingsData = {
  x: 1375,
  y: 475,
  width: 525,
  height: 400
}
export const Contracts: SettingsData = {
  x: 1500,
  y: 510,
  width: 400,
  height: 200
}
export const Augments: AugmentsSettings = {
  x: 1500,
  y: 545,
  width: 400,
  height: 200,
  // Mode options are currently: purchasable, uniques, rep
  mode: "uniques"
}
// noinspection ConfusingFloatingPointLiteralJS - How, exactly, is 1e9 confusing?
export const HacknetManager: HacknetSettings = {
  x: 1500,
  y: 750,
  width: 400,
  height: 200,
  maxPrice: 1e9,
  loopDelay: 10 * 1000,
  threshold: undefined
}
export const Deploy: DeploySettings = {
  x: 1500,
  y: 780,
  width: 400,
  height: 200,
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
    'w0r1d_d43m0n',
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
    //'crush-fitness',        // Gym - 3x cost,  2x exp
    //'snap-fitness',         // Gym - 10x cost, 5x exp
    //'summit-uni',           // Uni - 4x cost,  3x exp
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