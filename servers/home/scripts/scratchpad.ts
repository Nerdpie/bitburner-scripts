// noinspection IfStatementWithTooManyBranchesJS

import {Scratchpad, setTailWindow} from "@/servers/home/scripts/settings"
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits"
import {Player} from "NetscriptDefinitions";
import {sprintf} from "sprintf-js";
// noinspection ES6UnusedImports
import {CodingContractTypes} from "./coding_contracts/contract_util";


/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  setTailWindow(ns, Scratchpad);

  //ns.codingcontract.createDummyContract(CodingContractTypes["Algorithmic Stock Trader IV"])

  // Lame way to avoid having code purged from the scratchpad, but not executed
  const HUSH_IM_BUSY: number = -1

  if (HUSH_IM_BUSY === 1) {

    if (!globalThis.Companies) {
      exposeGameInternalObjects()
    }

    if (ns.fileExists('Formulas.exe', 'home')) {
      function calcFavorAfterReset(favor: number, rep: number): number {
        return ns.formulas.reputation.calculateRepToFavor(ns.formulas.reputation.calculateFavorToRep(favor) + rep);
      }

      globalThis.Companies.filter(c => c.playerReputation > 0 || c.favor > 8)
        .forEach(c => {
          //ns.print(sprintf('%-20s  Rep: %7d  Favor %4d', c.name, c.playerReputation, c.favor))
          ns.print(sprintf('%-20s  Favor %4d', c.name, calcFavorAfterReset(c.favor, c.playerReputation)))
        })
    }
  } else if (HUSH_IM_BUSY === 2) {
    const SECONDS_PER_MINUTE = 60;

    const me: Player = ns.getPlayer();

    //const chaLvl = me.skills.charisma;
    const chaExp = me.exp.charisma;
    const chaLvlMult = me.mults.charisma;
    //const chaExpMult = me.mults.charisma_exp;
    const TARGET_LEVEL = 725;
    const expForTargetLevel = ns.formulas.skills.calculateExp(TARGET_LEVEL, chaLvlMult);
    const expDiff = expForTargetLevel - chaExp;
    const gainPerCycle = ns.formulas.work.universityGains(me, "Leadership", "ZB Institute of Technology");
    const gainPerMillisecond = gainPerCycle.chaExp / 200;
    ns.printf("expDiff: %d", expDiff)
    ns.printf("gainPerSec: %d", gainPerMillisecond * 1000)
    const millisecondsNeeded = expDiff / gainPerMillisecond;

    ns.printf("Level %d requires class for %s", TARGET_LEVEL, ns.tFormat(millisecondsNeeded))
  } else if (HUSH_IM_BUSY === 3) {
    const currentWork = globalThis.Player.currentWork;
    // Goodie, different paths to the reputation rate depending upon the TYPE of work...
    if (currentWork?.type === 'FACTION') {
      // MEMO Does NOT account for any passive gains!
      const TARGET_REP = 75000;
      const currentFaction = currentWork.factionName
      const factionRep = globalThis.Factions[currentFaction].playerReputation
      const repPerSecond = currentWork.getReputationRate() * 5;
      ns.print(ns.tFormat((TARGET_REP - factionRep) / repPerSecond * 1000));
    } else if (currentWork?.type === 'COMPANY') {
      const TARGET_REP = 400000;
      const currentCompany = currentWork.companyName;
      const companyRep = globalThis.Companies[currentCompany].playerReputation;
      const currentJobTitle = globalThis.Player.jobs[currentCompany];
      const repPerSecond = currentWork.getGainRates(currentJobTitle).reputation * 5;
      ns.print(ns.tFormat((TARGET_REP - companyRep) / repPerSecond * 1000));
    }
  } else if (HUSH_IM_BUSY === 4) {
    const doc = globalThis['document'];
    // TODO Either unlock Singularity, or implement this to auto-buy the Tor router
    // Find one of the 'technology' locations
    // @ts-ignore - `innerText` certainly appears to be valid...
    const techStores = Array.from(doc.querySelectorAll(`span[class$='location']`)).filter(n => n.ariaLabel !== 'Travel Agency' && n.innerText === 'T')

    if (techStores && techStores.length > 0) {
      // @ts-ignore - Again, that IS a valid method...
      techStores[0].click();
    }
  }
}