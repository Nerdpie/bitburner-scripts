// noinspection MagicNumberJS

import {GangMisc} from "@/servers/home/scripts/gangs/gang_enums";

export function ascendMembers(ns: NS) {
  const members = ns.gang.getMemberNames();
  members.forEach((member) => {
    if (shouldAscendGangster(ns, member)) {
      ns.gang.ascendMember(member);
    }
  })
}

function shouldAscendGangster(ns: NS, member: string): boolean {
  // TODO Adjust threshold to account for territory warfare
  /*
  if (ns.gang.getMemberInformation(member).task === GangMisc["Territory Warfare"]){
    return false; // Ascending during warfare can mean death
  }
   */
  return (ns.gang.getAscensionResult(member)?.str ?? 0) > calculateAscendThreshold(ns, member);
}

// Credit: Mysteyes. https://discord.com/channels/415207508303544321/415207923506216971/940379724214075442
function calculateAscendThreshold(ns: NS, member: string) {
  const mult = ns.gang.getMemberInformation(member)['str_asc_mult'];
  if (mult < 1.632) {
    return 1.6326;
  }
  if (mult < 2.336) {
    return 1.4315;
  }
  if (mult < 2.999) {
    return 1.284;
  }
  if (mult < 3.363) {
    return 1.2125;
  }
  if (mult < 4.253) {
    return 1.1698;
  }
  if (mult < 4.860) {
    return 1.1428;
  }
  if (mult < 5.455) {
    return 1.1225;
  }
  if (mult < 5.977) {
    return 1.0957;
  }
  if (mult < 6.496) {
    return 1.0869;
  }
  if (mult < 7.008) {
    return 1.0789;
  }
  if (mult < 7.519) {
    return 1.073;
  }
  if (mult < 8.025) {
    return 1.0673;
  }
  if (mult < 8.513) {
    return 1.0631;
  }
  return 1.0591;
}