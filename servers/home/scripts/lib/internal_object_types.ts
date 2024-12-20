/*
Objects/modules exposed by the webpack exploit code:

Player
  - Exposes an unholy number of properties and functions... document later
Engine
  - I'm not deep enough into the code to worry about this one yet

Augmentations
  - donationBonus
  - metadata
FormatNumberModule
  - formatNumber
  - formatPercent
Terminal
Companies
  - metadata

SaveObjectModule - src/SaveObject
  - getSaveData
  - loadGame
AllServersModule - src/Server/AllServers
  - loadAllServers
  - saveAllServers
 */


export interface Faction {
  alreadyInvited: boolean;
  augmentations: string[]; // Technically typed as AugmentationName[]
  favor: number; // Public getter ONLY
  isBanned: boolean;
  isMember: boolean;
  discovery: FactionDiscovery;
  name: string; // Technically typed as FactionName
  playerReputation: number;
  // getInfo: () => FactionInfo; // May be valuable... later
  // Not specifying the methods to set favor, prestige
}

export enum FactionDiscovery {
  unknown = 'unknown',
  rumored = 'rumored',
  known = 'known',
}

export interface Augmentation {
  baseCost: number;
  baseRepRequirement: number;
  info: string;
  stats: string;
  isSpecial: boolean;
  name: string; // Technically typed as AugmentationName
  prereqs: string[]; // Technically typed as AugmentationName[]

}