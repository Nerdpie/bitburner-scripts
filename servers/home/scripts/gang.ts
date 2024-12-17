import {ascendMembers} from "@/servers/home/scripts/gangs/ascension";
import {
  GangArmor,
  GangEarning,
  GangEquipment,
  GangMisc,
  GangTask, GangTraining,
  GangVehicle,
  GangWeapon
} from "@/servers/home/scripts/gangs/gang_enums";
import {GangGenInfo} from "NetscriptDefinitions";

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
  ];
  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => {ns.disableLog(log)});

  // TODO Need logic to synchronize to the territory tick, and assign EVERYONE to Territory Warfare that tick for growth
  //  UNLESS clashes are enabled; then, check the stats before assigning

  // noinspection InfiniteLoopJS - Intended design
  while (true) {
    recruit(ns);
    ascendMembers(ns);
    equipMembers(ns);
    assignAll(ns);

    await ns.gang.nextUpdate();
  }
}

function recruit(ns: NS) {
  let success = false;
  let memberCount = ns.gang.getMemberNames().length;

  // REFINE Could check for the rep to recruit, instead
  do {
    // TODO Write a proper name generator...
    const name = memberCount.toString();
    success = ns.gang.recruitMember(name);
    memberCount++;
  } while (success)
}

function equipMembers(ns: NS) {
  const members = ns.gang.getMemberNames().map(member => ns.gang.getMemberInformation(member));
  const equipmentToBuy: GangEquipment[] = [
    GangArmor['Bulletproof Vest'],
    GangWeapon["Baseball Bat"],
    GangVehicle["Ford Flex V20"]
  ]

  // TODO Extend this to check for the cash-on-hand, and to get a non-fixed set of equipment
  for (const member of members) {
    equipmentToBuy.forEach(e => {
      if (!member.upgrades.includes(e)) {
        ns.gang.purchaseEquipment(member.name, e);
      }
    });
  }

}

function assignAll(ns: NS) {
  const members = ns.gang.getMemberNames();
  const gangInfo = ns.gang.getGangInformation()
  const wantedLevelPenalty = gangInfo.wantedPenalty;
  const PENALTY_THRESHOLD = -0.01;

  // REFINE Ideally, we would only assign enough to pull back the gain rate
  if ( PENALTY_THRESHOLD > wantedLevelPenalty ) {
    members.forEach(member => {ns.gang.setMemberTask(member, GangMisc["Vigilante Justice"])})
  } else {


    members.forEach(member => {
      ns.gang.setMemberTask(member, bestTaskForMember(ns, gangInfo, member));
    })
  }
}

function bestTaskForMember(ns: NS, gangInfo: GangGenInfo, member: string): GangTask {
  const memberInfo = ns.gang.getMemberInformation(member);
  let bestTask: [GangTask, number] = [GangTraining["Train Combat"], 0];
  if (ns.fileExists('Formulas.exe', 'home')) {
    for (const task in GangEarning) {
      const taskStats = ns.gang.getTaskStats(task);
      const gain = ns.formulas.gang.respectGain(gangInfo,memberInfo,taskStats);

      if ( gain > bestTask[1]) {
        bestTask = [GangEarning[task], gain];
      }
    }
  } else {
    // FIXME Determine an ACTUAL formula for this, not assigning arbitrarily...
    bestTask = [GangEarning["Traffick Illegal Arms"], 5];
  }

  return bestTask[0];
}