import type {Faction}                                    from "@/game_internal_types/Faction/Faction";
import type {FactionName}                                from "@enums";
import {exposeGameInternalObjects}                       from "@lib/exploits";
import {GangLord, setTailWindow}                         from "@settings";
import type {GangGenInfo, GangMemberInfo, GangOtherInfo} from "NetscriptDefinitions";
import {ascendMembers}                                   from "./gangs/ascension";
import * as GEnums                                       from "./gangs/gang_enums";

const config = GangLord;
let previousOtherGangInfo: GangOtherInfo | undefined;
let tickToNextTerritoryUpdate: number;

if (!globalThis.Factions) {
  exposeGameInternalObjects();
}

const factions = <Record<FactionName, Faction>>globalThis.Factions;

export async function main(ns: NS): Promise<void> {
  const DISABLED_LOGS = [
    "gang.setMemberTask",
    "gang.recruitMember",
    "getServerMoneyAvailable",
    "gang.purchaseEquipment",
    "gang.setTerritoryWarfare",
  ];
  ns.disableLog("disableLog");
  DISABLED_LOGS.forEach(log => {
    ns.disableLog(log);
  });

  setTailWindow(ns, config);

  if (!ns.gang.inGang()) {
    ns.tprint("Not yet in a gang!");
    return;
  }

  // noinspection InfiniteLoopJS - Intended design
  while (true) {
    syncTerritoryCycle(ns);
    recruit(ns);
    ascendMembers(ns);
    equipMembers(ns);
    // Determine if we will have a clash BEFORE sending members off to war
    mortalCombat(ns);
    assignAll(ns);
    await ns.gang.nextUpdate();
  }
}

function syncTerritoryCycle(ns: NS) {
  const otherGangInfo = ns.gang.getOtherGangInformation();
  /*
  Gang cycles are pushed every game cycle (200ms, or 5 times a second)
  While the stored gang cycles are less than the min to process (10 cycles, or two seconds), it waits
  Territory updates process every ten gang ticks (twenty seconds)
   */

  // Save a few calculations if we already beat the other gangs
  if (ns.gang.getGangInformation().territory === 1) {
    tickToNextTerritoryUpdate = 9;
    return;
  }

  if (isOtherGangInfoEqual(previousOtherGangInfo, otherGangInfo)) {
    // Effectively, subtracts one and wraps around
    tickToNextTerritoryUpdate = (tickToNextTerritoryUpdate + 9) % 10;
  } else {
    previousOtherGangInfo = otherGangInfo;
    tickToNextTerritoryUpdate = 9;
  }
}

function isOtherGangInfoEqual(previous: GangOtherInfo | undefined, current: GangOtherInfo): boolean {
  if (!previous) {
    return false;
  }

  for (const gang in previous) {
    if (previous[gang].power !== current[gang].power || previous[gang].territory !== current[gang].territory) {
      return false;
    }
  }
  return true;
}

function recruit(ns: NS) {
  function haveEnoughRespect(ns: NS): boolean {
    const gangInfo = ns.gang.getGangInformation();
    return gangInfo.respectForNextRecruit <= gangInfo.respect;
  }

  let success = true;
  while (haveEnoughRespect(ns) && success) {
    success = ns.gang.recruitMember(generateMemberName(ns));
  }
}

function generateMemberName(ns: NS): string {
  // Names I used in the first gang, before letting the script use numbers:
  // noinspection SpellCheckingInspection - Using names, so... to be expected
  const starterNames = [
    "Jim-Bob",
    "Billy-Bob",
    "Fred",
    "Cleetus",
    "Red",
    "Goob",
    "Goodie",
    "Two",
    "Shoes",
  ];

  // Names found at https://tagvault.org/blog/redneck-hillbilly-names/
  // noinspection SpellCheckingInspection - Using names, so... to be expected
  const moreNames = [
    "Gomer",
    "Bubba",
    "Earl",
    "Clem",
    "Flint",
    "Jed",
    "Festus",
    "Jasper",
    "Sarge",
    "Buford",
    "Leroy",
  ];

  const usedNames = ns.gang.getMemberNames();
  const availableNames = starterNames.concat(moreNames).filter(n => !usedNames.includes(n));

  return availableNames[Math.floor(Math.random() * availableNames.length)];
}

function equipMembers(ns: NS) {
  const members = ns.gang.getMemberNames().map(member => ns.gang.getMemberInformation(member));
  // TODO Extend this to prioritize more carefully and leave a buffer of on-hand cash

  // Get the augments first
  equipAllOfType(ns, members, GEnums.GangAugment, "augmentations");
  equipAllOfType(ns, members, GEnums.GangWeapon, "upgrades");
  equipAllOfType(ns, members, GEnums.GangArmor, "upgrades");
  equipAllOfType(ns, members, GEnums.GangVehicle, "upgrades");
  equipAllOfType(ns, members, GEnums.GangRootkit, "upgrades");
}

type GangEquip =
  typeof GEnums.GangAugment
  | typeof GEnums.GangWeapon
  | typeof GEnums.GangArmor
  | typeof GEnums.GangVehicle
  | typeof GEnums.GangRootkit;

function equipAllOfType(ns: NS, members: GangMemberInfo[], type: GangEquip, slot: "augmentations" | "upgrades") {
  for (const equipment in type) {
    const equipPrice = ns.gang.getEquipmentCost(equipment);
    members.forEach(member => {
      if (!member[slot].includes(equipment) && equipPrice < ns.getServerMoneyAvailable("home")) {
        const success = ns.gang.purchaseEquipment(member.name, equipment);

        if (success) {
          ns.print(`Bought ${member.name} the ${equipment}`);
        }
      }
    });
  }
}

function assignAll(ns: NS) {
  const members = ns.gang.getMemberNames();
  const gangInfo = ns.gang.getGangInformation();


  // REFINE Ideally, we would only assign enough to pull back the gain rate
  //  Or, better, assign a mix so we aren't constantly thrashing assignments...
  // Below a certain respect level, the best way to offset the wanted penalty is to gain more respect
  // Some advise to not worry about the wanted level, or to only pre-calc the impact for an ascension
  // May want to check the internal formulae and look at the ratio of wanted level & respect to penalty
  const reduceWantedLevel = config.wantedPenaltyThreshold > gangInfo.wantedPenalty && gangInfo.respect > config.vigilanteRespectThreshold && gangInfo.wantedLevel > 1;
  if (reduceWantedLevel && tickToNextTerritoryUpdate !== 0) {
    members.forEach(member => {
      ns.gang.setMemberTask(member, GEnums.GangMisc["Vigilante Justice"]);
    });
  } else {
    members.forEach(member => {
      ns.gang.setMemberTask(member, bestTaskForMember(ns, gangInfo, member));
    });
  }
}

function bestTaskForMember(ns: NS, gangInfo: GangGenInfo, member: string): GEnums.GangTask {
  const memberInfo = ns.gang.getMemberInformation(member);

  // Is it time to flash mob, and is the member at risk if they do so?
  if (tickToNextTerritoryUpdate === 0 && (memberInfo.def >= config.memberWarfareThreshold || !isClashPossible(gangInfo))) {
    return GEnums.GangMisc["Territory Warfare"];
  }

  // Early gains are slow; bootstrap it
  if (memberInfo.def < config.memberMinTraining) {
    return GEnums.GangTraining["Train Combat"];
  }

  const focusRep = config.mode === "rep"
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    && (factions[gangInfo.faction].playerReputation < config.targetFactionRep || gangInfo.respect < config.targetGangRespect);

  // REFINE May want to switch per-member, to keep them at a threshold of respect (helps with discounts)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const gainFunction = focusRep ? ns.formulas.gang.respectGain : ns.formulas.gang.moneyGain;

  // Default to training combat
  let bestTask: [GEnums.GangTask, number] = [GEnums.GangTraining["Train Combat"], 0];
  if (ns.fileExists("Formulas.exe", "home")) {
    for (const task in GEnums.GangEarning) {
      const taskStats = ns.gang.getTaskStats(task);
      const gain = gainFunction(gangInfo, memberInfo, taskStats);
      if (gain > bestTask[1]) {
        // This shouldn't be unsafe, as `task` should always be a valid key for the enum...
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        bestTask = [GEnums.GangEarning[task], gain];
      }
    }
  } else {
    // FIXME Determine an ACTUAL formula for this, not assigning arbitrarily...
    bestTask = [GEnums.GangEarning["Run a Con"], 5];
  }

  return bestTask[0];
}

function isClashPossible(gangInfo: GangGenInfo): boolean {
  return gangInfo.territoryWarfareEngaged || gangInfo.territoryClashChance > 0;
}

function mortalCombat(ns: NS) {
  const gangInfo = ns.gang.getGangInformation();
  const otherGangs: GangOtherInfo | undefined = previousOtherGangInfo;

  // If we have all territory, no point for further clashes to process
  if (gangInfo.territory === 1) {
    if (gangInfo.territoryWarfareEngaged) {
      ns.gang.setTerritoryWarfare(false);
      ns.print("Victory is ours!");
    }
    return;
  }

  if (!otherGangs) {
    throw new Error("Other gang info not retrieved before calling `mortalCombat`!");
  }

  let chanceTemp = 0.0;
  let numGangs = 0;
  for (const otherGang in otherGangs) {
    if (otherGangs[otherGang].territory > 0) {
      numGangs++;
      chanceTemp += (gangInfo.power / (gangInfo.power + otherGangs[otherGang].power));
    }
  }

  const avgChance = chanceTemp / numGangs;

  // Simplified comparison - only need to see if we are below the threshold once
  // Then, only call `setTerritoryWarfare` if the state doesn't match
  if (avgChance < config.territoryWarfareThreshold) {
    if (gangInfo.territoryWarfareEngaged) {
      ns.gang.setTerritoryWarfare(false);
      ns.print("Retreat!");
    }
  } else if (!gangInfo.territoryWarfareEngaged) {
    ns.gang.setTerritoryWarfare(true);
    ns.print("Attack!");
  }
}
