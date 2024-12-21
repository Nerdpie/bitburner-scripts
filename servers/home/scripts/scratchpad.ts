// noinspection IfStatementWithTooManyBranchesJS

import {Scratchpad, setTailWindow} from "@/servers/home/scripts/settings"
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits"
import {Player} from "NetscriptDefinitions";
import {sprintf} from "sprintf-js";


/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  setTailWindow(ns, Scratchpad);

  //ns.codingcontract.createDummyContract(CodingContractTypes["Algorithmic Stock Trader IV"])

  // Lame way to avoid having code purged from the scratchpad, but not executed
  const HUSH_IM_BUSY: number = 4

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
    const getFactionRep = (faction: string) => globalThis.Factions[faction].playerReputation
    const TARGET_REP = 75000;
    const getWorkRepPerSecond = () => globalThis.Player.currentWork.getReputationRate() * 5;
    ns.print(ns.tFormat((TARGET_REP - getFactionRep('Tian Di Hui')) / getWorkRepPerSecond() * 1000));
  } else if (HUSH_IM_BUSY === 4) {
    // Goodie, different paths to the reputation rate depending upon the TYPE of work...
    ns.print((400e3 - globalThis.Companies.MegaCorp.playerReputation) / (globalThis.Player.currentWork.getGainRates('Software Engineering Intern').reputation * 5) / 60);
  }
}