import type {Augmentation}                  from "@/game_internal_types/Augmentation/Augmentation";
import type {Faction}                       from "@/game_internal_types/Faction/Faction";
import type {PlayerObject}                  from "@/game_internal_types/PersonObjects/Player/PlayerObject";
import type {AugmentationName, FactionName} from "@enums";
import {arrayUnique}                        from "@lib/array_util";
import {exposeGameInternalObjects}          from "@lib/exploits";
import type {AugmentationCosts}             from "@lib/game_internals/AugmentationHelpers";
import {getAugCost}                         from "@lib/game_internals/AugmentationHelpers";
import {getFactionAugmentationsFiltered}    from "@lib/game_internals/FactionHelpers";
import {Augments, setTailWindow}            from "@settings";

// Run on import, so these are visible regardless
// Yes, this means side effects, if we have multiple instances etc.,
// but they should all point to the same instances ANYWAY...
if (!globalThis.Player) {
  exposeGameInternalObjects();
}

const factions = <Record<string, Faction>>globalThis.Factions;
const player = <PlayerObject>globalThis.Player;
const augs = <Record<AugmentationName, Augmentation>>globalThis.Augmentations;

const NFG = <AugmentationName>"NeuroFlux Governor";

const config = Augments;

export function main(ns: NS): void {
  setTailWindow(ns, config);

  // TODO Add special-case handling of NFG; worth showing its rep & cash cost
  switch (config.mode) {
    case "purchasable":
      showPurchasableAugs(ns);
      break;
    case "uniques":
      factionsWithUnboughtUniques(ns);
      break;
    case "rep":
      factionRepNeeded(ns);
      break;
    default:
      // This is a safeguard in case we add a new mode but do not properly implement it.
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      ns.print(`ERROR: Unknown augment config mode: ${config.mode}`);
  }
}

/*
Output functions
 */
function factionsWithUnboughtUniques(ns: NS, includeSoA: boolean = false) {
  const SOA = <FactionName>"Shadows of Anarchy";

  ns.print("Facs w/unique augs to buy:");

  const gangAugs = getGangAugs(ns);

  // Yes, I could remove half of these variables,
  // but it becomes a giant, hard-to-read mess
  const ownedAugNames = player.augmentations.map(a => a.name);
  const queuedAugNames = player.queuedAugmentations.map(a => a.name);
  // noinspection OverlyComplexBooleanExpressionJS
  let filteredAugs = Object.values(augs)
    .filter(aug => aug.factions.length === 1
      && !ownedAugNames.includes(aug.name)
      && !queuedAugNames.includes(aug.name)
      && (includeSoA || aug.factions[0] !== SOA) // Ignore infiltration
      && isEndgameFactionUnlocked(ns, aug.factions[0]));

  // If a gang has augs that would otherwise be uniques, focus the gang instead of the others;
  // will earn gang rep ANYWAY, so trim the list
  let gangHasUniques = false;
  if (filteredAugs.some(aug => gangAugs.includes(aug.name))) {
    gangHasUniques = true;
    filteredAugs = filteredAugs.filter(aug => !gangAugs.includes(aug.name));
  }

  const augFactions = filteredAugs.map(a => <string>a.factions[0]);

  if (gangHasUniques) {
    augFactions.push(player.getGangFaction().name);
  }

  const uniqueFactions = arrayUnique(augFactions).sort();

  if (uniqueFactions.length > 0) {
    uniqueFactions.forEach(fac => ns.printf("%-27s - F%6s", fac, ns.formatNumber(factions[fac].favor, 1)));
  } else {
    ns.print("All bought!");
  }
}

function showPurchasableAugs(ns: NS): void {
  ns.print("Purchasable augs by price:");

  const playerFacs = player.factions;
  const purchasableAugs = getPurchasableAugsWithGang(ns)
    .filter(aug => {
      // Only look at those where we have a faction with at least `repMargin` of the required rep
      // MEMO Leave `repNeeded` separate; otherwise, it will be recomputed for each candidate faction
      const repNeeded = aug.costs.repCost * config.repMargin;
      return aug.factions.some(faction => repNeeded <= factions[faction].playerReputation);
    })
    .sort((a, b) => b.costs.moneyCost - a.costs.moneyCost);

  if (purchasableAugs.length === 0) {
    ns.print("All bought!");
    return;
  }

  // REFINE Only show those factions where we have enough rep for the purchase,
  //  favoring the gang faction
  purchasableAugs.forEach(a => {
    ns.printf("%-25s - $%8s", truncateAugName(a.name), ns.formatNumber(a.costs.moneyCost));
    ns.print(a.factions.filter(f => playerFacs.includes(f)).map(truncateFacName));
  });
}

function factionRepNeeded(ns: NS): void {
  const playerFacs = player.factions;
  const purchasableAugs = getPurchasableAugsWithGang(ns);

  // TODO This does not account for SoA's scaling rep requirement
  ns.print("Add'l rep needed to buy augs:");

  if (purchasableAugs.length === 0) {
    ns.print("All bought!");
    return;
  }

  if (player.inGang()) {
    const gangFaction = player.getGangFaction().name;
    // Once the gang is going, it will get rep much faster than any other faction
    // Only list the gang for any augs where it is a supplying faction
    for (const aug of purchasableAugs) {
      if (aug.factions.includes(gangFaction)) {
        aug.factions = [gangFaction];
      }
    }
  }

  function maxRepRequirementForFaction(faction: FactionName): number {
    const maxRep = purchasableAugs.filter(a => a.factions.includes(faction))
      .reduce((acc, aug) => Math.max(acc, aug.costs.repCost), 0);

    // If we have excess rep, clamp at zero
    return Math.max(maxRep - factions[faction].playerReputation, 0);
  }

  const facsWithAugs = playerFacs.filter(f => purchasableAugs.some(a => a.factions.includes(f)));

  facsWithAugs.sort().forEach(f => ns.printf("%-16s - %6s", f, ns.formatNumber(maxRepRequirementForFaction(f), 1)));
}

/*
Augment utility methods
 */
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
    .replace("Optimization", "Opt");
}

/** @param {string} name */
function truncateFacName(name: string): string {
  switch (name) {
    case "Clarke Incorporated":
      return "Clarke";
    case "Bachman & Associates":
      return "BnA";
    case "OmniTek Incorporated":
      return "OmniTek";
    case "Shadows of Anarchy":
      return "SoA";
    case "Speakers for the Dead":
      return "Spk4Ded";
    case "Blade Industries":
      return "Blade";
    default:
      return name;
  }
}

function getGangAugs(ns: NS): AugmentationName[] {
  if (player.inGang()) {
    return getFactionAugmentationsFiltered(ns, player.getGangFaction());
  }
  return [];
}

function getPossibleGangAugs(ns: NS, faction: FactionName): AugmentationName[] {
  return getFactionAugmentationsFiltered(ns, factions[faction], true);
}

function isEndgameFactionUnlocked(ns: NS, faction: FactionName): boolean {
  // @ts-expect-error - It's a string enum...
  const endgameFactions: FactionName[] = ["Bladeburners", "Church of the Machine God"];
  const CHURCH_MACHINE_GOD = <FactionName>"Church of the Machine God";
  const BLADEBURNERS = <FactionName>"Bladeburners";
  const MACHINE_GOD_NODE = 13;
  const BLADEBURNER_NODES = [6, 7];
  if (!endgameFactions.includes(faction)) {
    return true;
  }

  // REFINE Check when `getResetInfo` is available
  const resetInfo = ns.getResetInfo();
  switch (faction) {
    case CHURCH_MACHINE_GOD:
      return resetInfo.ownedSF.has(MACHINE_GOD_NODE) || resetInfo.currentNode === MACHINE_GOD_NODE;
    case BLADEBURNERS:
      return BLADEBURNER_NODES.some(n => resetInfo.ownedSF.has(n) || resetInfo.currentNode === n);
  }

  throw new Error(`Faction not properly handled: ${faction}`);
}

// Keep for now
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPurchasableAugs(): Augmentation[] {
  const ownedAugNames = player.augmentations.map(a => a.name);
  const queuedAugNames = player.queuedAugmentations.map(a => a.name);
  const playerFacs = player.factions;
  // noinspection OverlyComplexBooleanExpressionJS
  return Object.values<Augmentation>(augs)
    .filter(a => a.factions.some(f => playerFacs.includes(f))
      && !ownedAugNames.includes(a.name)
      && !queuedAugNames.includes(a.name)
      && NFG !== a.name);
}

type AugWrapper = { name: AugmentationName; factions: FactionName[]; costs: AugmentationCosts };

function getPurchasableAugsWithGang(ns: NS): AugWrapper[] {
  const ownedAugNames = player.augmentations.map(a => a.name);
  const queuedAugNames = player.queuedAugmentations.map(a => a.name);
  const augNames = player.factions.flatMap(faction => getFactionAugmentationsFiltered(ns, factions[faction]));

  // TODO Why do I have this sorted TWICE?
  const filteredNames = arrayUnique(augNames).sort()
    .filter(a => !ownedAugNames.includes(a)
      && !queuedAugNames.includes(a)
      && NFG !== a)
    .sort();

  const augments = filteredNames.map(name => augs[name]);

  const wrappers = augments.map((aug): AugWrapper => ({
    name: aug.name,
    factions: aug.factions.slice(),
    costs: getAugCost(ns, aug),
  }));

  // TODO There should be a cleaner way of doing this than querying gang augs twice
  if (player.inGang()) {
    const gangAugs = getGangAugs(ns);
    const gangFaction = player.getGangFaction().name;

    wrappers.forEach(w => {
      if (gangAugs.includes(w.name) && !w.factions.includes(gangFaction)) {
        w.factions.push(gangFaction);
      }
    });
  }

  return wrappers;
}
