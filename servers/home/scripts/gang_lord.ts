import {ascendMembers} from "@/servers/home/scripts/gangs/ascension";
import * as GEnums from "@/servers/home/scripts/gangs/gang_enums";
import {GangGenInfo, GangMemberInfo, GangOtherInfo} from "NetscriptDefinitions";
import {GangLord, setTailWindow} from "@/servers/home/scripts/settings";
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits";

const config = GangLord;

export async function main(ns: NS): Promise<void> {
  /*
  Denis' outermost loop is:

    function tick() {
    recruit();
    equipMembers(); // Equip everyone
    ascend();
    equipMembers(); // Equip ascended members
    updateTerritory();
    assignAll();
  }

  // begin territory warfare; synchronize to clashes
  for (; ; await waitCycle(17500, tick)) await syncWarfareTick();
   */

  const DISABLED_LOGS = [
    'gang.setMemberTask',
    'gang.recruitMember',
    'getServerMoneyAvailable',
  ];
  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => {
    ns.disableLog(log)
  });

  setTailWindow(ns, config);

  if (!globalThis.Factions) {
    exposeGameInternalObjects();
  }

  // TODO Need logic to synchronize to the territory tick, and assign EVERYONE to Territory Warfare that tick for growth
  //  UNLESS clashes are enabled; then, check the stats before assigning

  // noinspection InfiniteLoopJS - Intended design
  while (true) {
    recruit(ns);
    ascendMembers(ns);
    equipMembers(ns);
    assignAll(ns);
    mortalCombat(ns);
    await ns.gang.nextUpdate();
  }
}

function recruit(ns: NS) {
  let success = true;
  const getGangInfo = ns.gang.getGangInformation;
  while (getGangInfo().respectForNextRecruit <= getGangInfo().respect && success) {
    success = ns.gang.recruitMember(generateMemberName(ns));
  }
}

function generateMemberName(ns: NS): string {
  // Names I used in the first gang, before letting the script use numbers:
  // noinspection SpellCheckingInspection - Using names, so... to be expected
  const starterNames = [
    'Jim-Bob',
    'Billy-Bob',
    'Fred',
    'Cleetus',
    'Red',
    'Goob',
    'Goodie',
    'Two',
    'Shoes',
  ]

  // Names found at https://tagvault.org/blog/redneck-hillbilly-names/
  // noinspection SpellCheckingInspection - Using names, so... to be expected
  const moreNames = [
    'Gomer',
    'Bubba',
    'Earl',
    'Clem',
    'Flint',
    'Jed',
    'Festus',
    'Jasper',
    'Sarge',
    'Buford',
    'Leroy',
  ]

  const usedNames = ns.gang.getMemberNames();
  const availableNames = starterNames.concat(moreNames).filter(n => !usedNames.includes(n));

  return availableNames[Math.floor(Math.random() * availableNames.length)];
}

function equipMembers(ns: NS) {
  const members = ns.gang.getMemberNames().map(member => ns.gang.getMemberInformation(member));
  // TODO Extend this to prioritize more carefully and leave a buffer of on-hand cash

  // Get the augments first
  equipAllAugments(ns, members)

  equipAllOfType(ns, members, GEnums.GangWeapon);
  equipAllOfType(ns, members, GEnums.GangArmor);
  equipAllOfType(ns, members, GEnums.GangVehicle);
  equipAllOfType(ns, members, GEnums.GangRootkit);

  /*
  const equipmentToBuy: GangEquipment[] = [
    GangArmor['Bulletproof Vest'],
    GangWeapon["Baseball Bat"],
    GangVehicle["Ford Flex V20"]
  ]

  for (const member of members) {
    equipmentToBuy.forEach(e => {
      if (!member.upgrades.includes(e)) {
        ns.gang.purchaseEquipment(member.name, e);
      }
    });
  }
   */

}

function equipAllAugments(ns: NS, members: GangMemberInfo[]) {
  for (const equipment in GEnums.GangAugment) {
    const equipPrice = ns.gang.getEquipmentCost(equipment);
    members.forEach(member => {
      if (!member.augmentations.includes(equipment) && equipPrice < ns.getServerMoneyAvailable('home')) {
        ns.gang.purchaseEquipment(member.name, equipment);
      }
    })
  }
}

function equipAllOfType(ns: NS, members: GangMemberInfo[], type: any) {
  for (const equipment in type) {
    const equipPrice = ns.gang.getEquipmentCost(equipment);
    members.forEach(member => {
      if (!member.upgrades.includes(equipment) && equipPrice < ns.getServerMoneyAvailable('home')) {
        ns.gang.purchaseEquipment(member.name, equipment);
      }
    })
  }
}

function assignAll(ns: NS) {
  const members = ns.gang.getMemberNames();
  const gangInfo = ns.gang.getGangInformation()


  // REFINE Ideally, we would only assign enough to pull back the gain rate
  //  Or, better, assign a mix so we aren't constantly thrashing assignments...
  // Below a certain respect level, the best way to offset the wanted penalty is to gain more respect
  if (config.wantedPenaltyThreshold > gangInfo.wantedPenalty && gangInfo.respect > 10) {
    members.forEach(member => {
      if (ns.gang.getMemberInformation(member).task !== GEnums.GangMisc["Territory Warfare"]) {
        ns.gang.setMemberTask(member, GEnums.GangMisc["Vigilante Justice"])
      }
    })
  } else {
    members.forEach(member => {
      ns.gang.setMemberTask(member, bestTaskForMember(ns, gangInfo, member));
    })
  }
}

function bestTaskForMember(ns: NS, gangInfo: GangGenInfo, member: string): GEnums.GangTask {
  const memberInfo = ns.gang.getMemberInformation(member);

  // Is the member 'ready to fight', and is there territory to claim yet?
  if (memberInfo.def >= config.memberWarfareThreshold && gangInfo.territory < 1) {
    return GEnums.GangMisc["Territory Warfare"];
  }

  if (memberInfo.def < config.memberMinTraining) {
    return GEnums.GangTraining["Train Combat"];
  }

  const focusRep = config.mode === 'rep'
    && ( globalThis.Factions[gangInfo.faction].playerReputation < config.targetFactionRep || gangInfo.respect < config.targetGangRespect );

  // REFINE May want to switch per-member, to keep them at a threshold of respect (helps with discounts)
  const gainFunction = focusRep ? ns.formulas.gang.respectGain : ns.formulas.gang.moneyGain;

  // Default to training combat
  let bestTask: [GEnums.GangTask, number] = [GEnums.GangTraining["Train Combat"], 0];
  if (ns.fileExists('Formulas.exe', 'home')) {
    for (const task in GEnums.GangEarning) {
      const taskStats = ns.gang.getTaskStats(task);
      const gain = gainFunction(gangInfo, memberInfo, taskStats);
      if (gain > bestTask[1]) {
        bestTask = [GEnums.GangEarning[task], gain];
      }
    }
  } else {
    // FIXME Determine an ACTUAL formula for this, not assigning arbitrarily...
    bestTask = [GEnums.GangEarning["Traffick Illegal Arms"], 5];
  }

  return bestTask[0];
}

function mortalCombat(ns: NS) {
  const gangInfo = ns.gang.getGangInformation();
  const otherGangs: GangOtherInfo = ns.gang.getOtherGangInformation();

  if (gangInfo.territory === 1) {
    if (gangInfo.territoryWarfareEngaged) {
      ns.gang.setTerritoryWarfare(false);
    }
    return;
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
    }
  } else if (!gangInfo.territoryWarfareEngaged) {
    ns.gang.setTerritoryWarfare(true);
  }
}