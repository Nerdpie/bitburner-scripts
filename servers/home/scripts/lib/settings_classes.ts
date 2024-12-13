import {TailProperties} from "NetscriptDefinitions";
import {BuiltinServers} from "@/servers/home/scripts/lib/builtin_servers";

// FIXME Determine the proper utility types, declaration (e.g. type, interface, class)
//  to expose the required and extended fields

export interface SettingsData extends TailProperties {
  // Yes, I could just use `TailProperties` directly...
}

export enum GoFaction {
  /** Hacknet production bonus */
    "Netburners" = "Netburners",
  /** Crime success rate */
    'Slum Snakes' = "Slum Snakes",
  /** Hacking money */
    'The Black Hands' = "The Black Hands",
  /** Combat levels */
    'Tetrads' = "Tetrads",
  /** Reputation gain */
    'Daedalus' = "Daedalus",
  /** Faster hack/grow/weaken */
    'Illuminati' = "Illuminati",
  /** Hacking level */
    '????????????' = '????????????',
  /** Practice, script testing */
    'No AI' = "No AI",
}

export interface GoSettings extends SettingsData {
  keepPlaying: boolean;
  loopDelay: number;
  faction: GoFaction;
  // noinspection MagicNumberJS - Valid board sizes for IPvGo
  boardSize: 5 | 7 | 9 | 13;
}

export interface AugmentsSettings extends SettingsData {
  mode: 'purchasable' | 'uniques' | 'rep';
}

export interface HacknetSettings extends SettingsData {
  maxPrice: number;
  loopDelay: number;
  threshold: number;
}

export interface DeploySettings extends SettingsData {
  mode: 'hgw' | 'share';
  resetScripts: boolean;
  targetSelf: boolean;
  targetServer: BuiltinServers;
  loopDelay: number;
  // noinspection MagicNumberJS
  ramCapacity: 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536 | 131072 | 262144 | 524288 | 1048576;
  shareCount: number;
  weakenCount: number;
  growCount: number;
  clusterCount: number;
}