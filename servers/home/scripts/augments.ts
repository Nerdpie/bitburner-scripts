import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits"
import {Augments, setTailWindow} from "@/servers/home/scripts/settings"
import {arrayUnique} from "@/servers/home/scripts/lib/array_util";
// noinspection ES6UnusedImports - Used in type specifier
import type {Augmentation} from "@/game_internal_types/Augmentation/Augmentation";
import type {AugmentationName, FactionName} from "@enums";
import type {Faction} from "@/game_internal_types/Faction/Faction";
import type {PlayerObject} from "@/game_internal_types/PersonObjects/Player/PlayerObject";

// noinspection JSUnusedLocalSymbols
function _typeHints() {
  // noinspection JSUnusedLocalSymbols
  const factions = <Record<string, Faction>>globalThis.Factions;
  // noinspection JSUnusedLocalSymbols
  const player = <PlayerObject>globalThis.Player;
  // noinspection JSUnusedLocalSymbols
  const augs = <Record<AugmentationName, Augmentation>>globalThis.Augmentations;
}

const config = Augments;

export async function main(ns: NS): Promise<void> {

  if (!globalThis.Player) {
    exposeGameInternalObjects();
  }

  setTailWindow(ns, config);

  // FIXME None of these account for gang augment sales
  // TODO Add special-case handling of NFG; worth showing its rep & cash cost
  switch (config.mode) {
    case 'purchasable':
      showPurchasableAugs(ns);
      break;
    case 'uniques':
      factionsWithUnboughtUniques(ns);
      break;
    case 'rep':
      factionRepNeeded(ns);
      break;
    default:
      ns.print(`ERROR: Unknown augment config mode: ${config.mode}`);
  }
}

function factionsWithUnboughtUniques(ns: NS) {
  ns.print("Facs w/unique augs to buy:")

  function isEndgameFactionUnlocked(faction: FactionName): boolean {
    // @ts-ignore - It's a string enum...
    const endgameFactions: FactionName[] = ["Bladeburners", "Church of the Machine God"];
    const MACHINE_GOD_NODE = 13
    const BLADEBURNER_NODES = [6, 7]
    if (!endgameFactions.includes(faction)) {
      return true;
    }

    // REFINE Check when `getResetInfo` is available
    const resetInfo = ns.getResetInfo();
    switch (faction) {
      case "Church of the Machine God":
        return resetInfo.ownedSF.has(MACHINE_GOD_NODE) || resetInfo.currentNode === MACHINE_GOD_NODE
      case "Bladeburners":
        return BLADEBURNER_NODES.some(n => resetInfo.ownedSF.has(n) || resetInfo.currentNode === n);
    }
  }

  // Yes, I could remove half of these variables,
  // but it becomes a giant, hard-to-read mess
  const ownedAugNames = globalThis.Player.augmentations.map(a => a.name);
  const queuedAugNames = globalThis.Player.queuedAugmentations.map(a => a.name);
  const filteredAugs = Object.values<Augmentation>(globalThis.Augmentations)
    .filter(aug => aug.factions.length === 1)
    .filter(aug => !ownedAugNames.includes(aug.name))
    .filter(aug => !queuedAugNames.includes(aug.name))
    .filter(aug => aug.factions[0] !== 'Shadows of Anarchy') // Ignore infiltration
    .filter(aug => isEndgameFactionUnlocked(aug.factions[0]))
    .map(a => a.factions[0]);

  const augFactions = arrayUnique(filteredAugs).sort();

  if (augFactions.length > 0) {
    augFactions.forEach(fac => ns.printf("%-27s - F%6s", fac, ns.formatNumber(globalThis.Factions[fac].favor, 1)));
  } else {
    ns.print("All bought!");
  }
}

/** @param {string} name */
function truncateAugName(name: string): string {
  // noinspection SpellCheckingInspection
  return name
    .replace("Embedded", "Embed")
    .replace("Module", "Mod")
    .replace("Artificial", "Arti")
    .replace("Network", "Net")
    .replace("Implant", "Impl")
    .replace("Upgrade", "Upgd")
    .replace("Signal", "Sig")
    .replace("Processor", "Proc")
    .replace("Netburner", "NB")
    .replace("Accelerator", "Accel")
    .replace("Cloaking", "Cloak")
    .replace(" Gen ", " g")
    .replace("Graphene", "Grphn")
    .replace("Direct Memory Access", "DMA")
    .replace("Direct", "Dir")
    .replace("Memory", "Mem")
    .replace("Direct-Neural", "Dir-Neur")
    .replace("Enhanced", "Enh")
    .replace("Modification", "Mod")
    .replace("Interface", "Intf")
    .replace("Optimization", "Opt")
}

/** @param {string} name */
function truncateFacName(name: string): string {
  switch (name) {
    case 'Clarke Incorporated':
      return 'Clarke';
    case 'Bachman & Associates':
      return 'BnA';
    case 'OmniTek Incorporated':
      return 'OmniTek';
    case 'Shadows of Anarchy':
      return 'SoA';
    case 'Speakers for the Dead':
      return 'Spk4Ded';
    case 'Blade Industries':
      return 'Blade';
    default:
      return name;
  }
}

function getPurchasableAugs(): Augmentation[] {
  const ownedAugNames = globalThis.Player.augmentations.map(a => a.name);
  const queuedAugNames = globalThis.Player.queuedAugmentations.map(a => a.name);
  const playerFacs = globalThis.Player.factions;
  return Object.values<Augmentation>(globalThis.Augmentations)
    .filter(a => a.factions.some(f => playerFacs.includes(f)))
    .filter(a => !ownedAugNames.includes(a.name))
    .filter(a => !queuedAugNames.includes(a.name))
    .filter(a => 'NeuroFlux Governor' !== a.name)
}

function getRepMultiplier(ns: NS) {
  try {
    return ns.getBitNodeMultipliers().AugmentationRepCost
  } catch {
    // If we haven't unlocked `getBitNodeMultipliers`, just use the default multiplier of 1
  }
  return 1;
}

function getCostMultiplier(ns: NS) {
  try {
    return ns.getBitNodeMultipliers().AugmentationMoneyCost
  } catch {
    // If we haven't unlocked `getBitNodeMultipliers`, just use the default multiplier of 1
  }
  return 1;
}

/** @param {NS} ns */
function showPurchasableAugs(ns: NS): void {
  ns.print("Purchasable augs by price:")

  const playerFacs: FactionName[] = globalThis.Player.factions;
  const getFactionRep = (faction: FactionName): number => globalThis.Factions[faction].playerReputation;
  const repMultiplier = getRepMultiplier(ns);

  const purchasableAugs = getPurchasableAugs()
    .filter(aug => {
      // Only look at those where we have a faction with at least `repMargin` of the required rep
      const repNeeded = aug.baseRepRequirement * repMultiplier;
      return aug.factions.some(faction =>
        repNeeded * config.repMargin <= getFactionRep(faction)
      )
    })
    .sort((a, b) => b.baseCost - a.baseCost);

  let costMultiplier = getCostMultiplier(ns);

  // This value comes from src/Constants
  const MULTIPLE_AUG_MULTIPLIER = 1.9
  // This logic is derived from `src/Augmentation/AugmentationHelpers`, and MAY NOT BE ACCURATE AFTER UPDATES!
  const AUG_COST_NODE = 11;
  const AUG_COST_MULTS = [1, 0.96, 0.94, 0.93]
  const additionalAugMultiplier = MULTIPLE_AUG_MULTIPLIER * AUG_COST_MULTS[globalThis.Player.activeSourceFileLvl(AUG_COST_NODE)];
  costMultiplier *= Math.pow(additionalAugMultiplier, globalThis.Player.queuedAugmentations.length)


  if (purchasableAugs.length > 0) {
    purchasableAugs.forEach(a => {
      ns.printf("%-25s - $%8s", truncateAugName(a.name), ns.formatNumber(a.baseCost * costMultiplier))
      ns.print(a.factions.filter(f => playerFacs.includes(f)).map(truncateFacName))
    })
  } else {
    ns.print("All bought!");
  }
}

function factionRepNeeded(ns: NS): void {
  const playerFacs: FactionName[] = globalThis.Player.factions;
  const purchasableAugs = getPurchasableAugs();

  ns.print("Add'l rep needed to buy augs:");

  if (!purchasableAugs || purchasableAugs.length === 0) {
    ns.print('All bought!');
    return;
  }

  const repMultiplier = getRepMultiplier(ns)

  function maxRepRequirementForFaction(faction: FactionName): number {
    const maxRep = purchasableAugs.filter(a => a.factions.includes(faction))
      .map(a => a.baseRepRequirement)
      .reduce((acc, rep) => Math.max(acc, rep), 0) * repMultiplier;

    // If we have excess rep, clamp at zero
    return Math.max(maxRep - globalThis.Factions[faction].playerReputation, 0);
  }

  const facsWithAugs = playerFacs.filter(f => purchasableAugs.some(a => a.factions.includes(f)));

  facsWithAugs.sort().forEach(f => ns.printf('%-16s - %6s', f, ns.formatNumber(maxRepRequirementForFaction(f), 1)))
}