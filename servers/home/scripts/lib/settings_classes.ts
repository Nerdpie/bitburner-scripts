import {TailProperties} from "NetscriptDefinitions";
import {BuiltinServers} from "@/servers/home/scripts/lib/builtin_servers";
import {
  AugmentsModes, DeployMode,
  GoBoardSizes,
  GoFaction,
  ValidRamCapacity
} from "@/servers/home/scripts/lib/enum_and_limiter_definitions";

export interface SettingsData extends TailProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  tailTitle?: string;
}

export interface RunSettings extends SettingsData {
  exclusionPattern: string | RegExp;
}

export interface GoSettings extends SettingsData {
  keepPlaying: boolean;
  loopDelay: number;
  faction: GoFaction;
  boardSize: GoBoardSizes;
}

export interface GangSettings extends SettingsData {
  // TODO Determine what settings to track
}

export interface AugmentsSettings extends SettingsData {
  mode: AugmentsModes;
}

export interface HacknetSettings extends SettingsData {
  maxPrice: number;
  loopDelay: number;
  threshold: number;
}

export interface DeploySettings extends SettingsData {
  mode: DeployMode;
  resetScripts: boolean;
  targetSelf: boolean;
  targetServer: BuiltinServers;
  loopDelay: number;
  ramCapacity: ValidRamCapacity;
  shareCount: number;
  weakenCount: number;
  growCount: number;
  clusterCount: number;
}