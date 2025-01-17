import type * as EnumsAndTypes from "@lib/enum_and_limiter_definitions";

// TODO Reevaluate extending TailProperties once we have tested the fontSize property
export interface SettingsData {
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
  boardSize: EnumsAndTypes.GoBoardSize;
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
  purchaseThreshold: number;
}

export interface AugmentsSettings extends SettingsData {
  repMargin: number;
  mode: EnumsAndTypes.AugmentsMode;
}

export interface HacknetSettings extends SettingsData {
  maxPrice: number;
  loopDelay: number;
  threshold: number;
}

export interface DeploySettings extends SettingsData {
  mode: EnumsAndTypes.DeployMode;
  resetScripts: boolean;
  dynamicTarget: boolean;
  targetSelf: boolean;
  targetServer: EnumsAndTypes.BuiltinServer;
  loopDelay: number;
  ramCapacity: EnumsAndTypes.ValidRamCapacity;
  purchaseThreshold: number;
  shareCount: number;
  weakenCount: number;
  growCount: number;
  prepCount: number;
  clusterCount: number;
  homeReservedRam: number;
  hackTheWorld: boolean;
}
