import {TailProperties} from "NetscriptDefinitions";
import {BuiltinServers} from "@/servers/home/scripts/lib/builtin_servers";
import * as EnumsAndTypes from "@/servers/home/scripts/lib/enum_and_limiter_definitions";

export interface SettingsData extends TailProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  tailTitle?: string;
}

export interface RunSettings extends SettingsData {
  exclusionPattern: RegExp;
}

export interface GoSettings extends SettingsData {
  keepPlaying: boolean;
  loopDelay: number;
  faction: EnumsAndTypes.GoFaction;
  boardSize: EnumsAndTypes.GoBoardSizes;
}

export interface GangSettings extends SettingsData {
  maxRep: number;
  mode: EnumsAndTypes.GangMode;
  wantedPenaltyThreshold: number;
  territoryWarfareThreshold: number;
  memberWarfareThreshold: number;
  memberMinTraining: number;
  targetFactionRep: number;
  targetGangRespect: number;
  vigilanteRespectThreshold: number;
}

export interface AugmentsSettings extends SettingsData {
  repMargin: number;
  mode: EnumsAndTypes.AugmentsModes;
}

export interface HacknetSettings extends SettingsData {
  maxPrice: number;
  loopDelay: number;
  threshold: number;
}

export interface DeploySettings extends SettingsData {
  mode: EnumsAndTypes.DeployMode;
  resetScripts: boolean;
  targetSelf: boolean;
  targetServer: BuiltinServers;
  loopDelay: number;
  ramCapacity: EnumsAndTypes.ValidRamCapacity;
  shareCount: number;
  weakenCount: number;
  growCount: number;
  clusterCount: number;
  homeReservedRam: number;
}