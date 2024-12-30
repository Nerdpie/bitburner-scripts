// Derived from bitburner-src/src/Faction/FactionHelpers.tsx
import type {Faction} from "@/game_internal_types/Faction/Faction";
import type {AugmentationName} from "@enums";
import {exposeGameInternalObjects} from "../exploits";
import type {PlayerObject} from "@/game_internal_types/PersonObjects/Player/PlayerObject";
import type {Augmentation} from "@/game_internal_types/Augmentation/Augmentation";
import {SFC32RNG} from "./RNG";
import {getGangUniqueAug} from "../bitnode_util";

export function getFactionAugmentationsFiltered(ns: NS, faction: Faction): AugmentationName[] {
  if (!globalThis.Player) {
    exposeGameInternalObjects();
  }

  const player: PlayerObject = globalThis.Player;
  const Augmentations = <Record<AugmentationName, Augmentation>>globalThis.Augmentations;

  // If player has a gang with this faction, return (almost) all augmentations
  if (player.hasGangWith(faction.name)) {
    let augs = Object.values(Augmentations);

    // Remove special augs
    augs = augs.filter((a) => !a.isSpecial && a.name !== "violet Congruity Implant");

    if (player.bitNodeN === 2) {
      // TRP is not available outside of BN2 for Gangs
      augs.push(Augmentations["The Red Pill"]);
    }

    const rng = SFC32RNG(`BN${player.bitNodeN}.${player.activeSourceFileLvl(player.bitNodeN)}`);
    // Remove faction-unique augs that don't belong to this faction
    const uniqueFilter = (a: Augmentation): boolean => {
      // Keep all the non-unique one
      if (a.factions.length > 1) {
        return true;
      }
      // Keep all the ones that this faction has anyway.
      if (faction.augmentations.includes(a.name)) {
        return true;
      }



      return rng() >= 1 - getGangUniqueAug(ns);
    };
    augs = augs.filter(uniqueFilter);

    return augs.map((a) => a.name);
  }

  return faction.augmentations.slice();
}