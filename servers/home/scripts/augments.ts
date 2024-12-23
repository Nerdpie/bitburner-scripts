import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits"
import {Augments, setTailWindow} from "@/servers/home/scripts/settings"
import {arrayUnique} from "@/servers/home/scripts/lib/array_util";

export async function main(ns: NS): Promise<void> {

  if (!globalThis.Player) {
    exposeGameInternalObjects();
  }

  const config = Augments;
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

  // Yes, I could remove half of these variables,
  // but it becomes a giant, hard-to-read mess
  const ownedAugNames = globalThis.Player.augmentations.map(a => a.name);
  const filteredAugs = globalThis.Augmentations.metadata
    .filter(aug => aug.factions.length === 1)
    .filter(aug => !ownedAugNames.includes(aug.name))
    .filter(aug => aug.factions[0] !== 'Shadows of Anarchy') // Ignore infiltration
    .map(a => a.factions[0]);

  const augFactions = arrayUnique(filteredAugs).sort();

  if (augFactions.length > 0) {
    augFactions.forEach(fac => ns.printf("- %s", fac));
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

function getPurchasableAugs(): any[] {
  const ownedAugNames = globalThis.Player.augmentations.map(a => a.name);
  const queuedAugNames = globalThis.Player.queuedAugmentations.map(a => a.name);
  const playerFacs = globalThis.Player.factions;
  return globalThis.Augmentations.metadata
    .filter(a => a.factions.some(f => playerFacs.includes(f)))
    .filter(a => !ownedAugNames.includes(a.name))
    .filter(a => !queuedAugNames.includes(a.name))
    .filter(a => 'NeuroFlux Governor' !== a.name)
}

/** @param {NS} ns */
function showPurchasableAugs(ns: NS): void {
  ns.print("Purchasable augs by price:")

  const playerFacs: string[] = globalThis.Player.factions;

  const purchasableAugs: any[] = getPurchasableAugs()
    // TODO Filter on the rep requirement, within some percent of current rep
    //  Will need to account for rep with ANY faction offering the aug
    .sort((a, b) => b.baseCost - a.baseCost);

  if (purchasableAugs.length > 0) {
    purchasableAugs.forEach(a => {
      ns.printf("%-25s - $%8s", truncateAugName(a.name), ns.formatNumber(a.baseCost))
      ns.print(a.factions.filter(f => playerFacs.includes(f)).map(truncateFacName))
    })
  } else {
    ns.print("All bought!");
  }
}

function factionRepNeeded(ns: NS): void {
  const playerFacs: string[] = globalThis.Player.factions;
  const purchasableAugs = getPurchasableAugs();

  ns.print("Add'l rep needed to buy augs:");

  if (!purchasableAugs || purchasableAugs.length === 0) {
    ns.print('All bought!');
    return;
  }

  function maxRepRequirementForFaction(faction: string): number {
    const maxRep = purchasableAugs.filter(a => a.factions.includes(faction))
      .map(a => a.baseRepRequirement)
      .reduce((acc, rep) => Math.max(acc, rep), 0)

    // If we have excess rep, clamp at zero
    return Math.max(maxRep - globalThis.Factions[faction].playerReputation, 0);
  }

  const facsWithAugs = playerFacs.filter(f => purchasableAugs.some(a => a.factions.includes(f)));

  facsWithAugs.sort().forEach((f: string) => ns.printf('%-16s - %6s', f, ns.formatNumber(maxRepRequirementForFaction(f), 1)))
}