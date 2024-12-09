import { ScriptSettings } from "@/servers/home/scripts/settings"
import { exposeGameInternalObjects } from "@/servers/home/scripts/lib/exploits"
import {Player} from "NetscriptDefinitions";
import {sprintf} from "sprintf-js";


/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  ns.tail();
  ns.clearLog();

  let config = ScriptSettings.scratchpad;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);




  let me: Player = ns.getPlayer();

  if (!globalThis.Companies) {
    exposeGameInternalObjects()
  }

  function calcFavorAfterReset(favor: number, rep :number) :number {
    return ns.formulas.reputation.calculateRepToFavor(ns.formulas.reputation.calculateFavorToRep(favor) + rep);
  }

  globalThis.Companies.metadata.filter(c => c.playerReputation > 0 || c.favor > 8)
    .forEach(c => {
      //ns.print(sprintf('%-20s  Rep: %7d  Favor %4d', c.name, c.playerReputation, c.favor))
      ns.print(sprintf('%-20s  Favor %4d', c.name, calcFavorAfterReset(c.favor, c.playerReputation)))
    })


  /*
    let chaLvl = me.skills.charisma;
    let chaExp = me.exp.charisma;
    let chaLvlMult = me.mults.charisma;
    let chaExpMult = me.mults.charisma_exp;
    let expForLevel300 = ns.formulas.skills.calculateExp(300, chaLvlMult);
    let expDiff = expForLevel300 - chaExp
    let gainPerCycle = ns.formulas.work.universityGains(me, "Leadership", "Rothman University")
    let gainPerSec = gainPerCycle.chaExp * 5
    ns.printf("expDiff: %d", expDiff)
    ns.printf("gainPerSec: %d", gainPerSec)
    let secondsNeeded = expDiff / gainPerSec;
    let minutesNeeded = Math.floor(secondsNeeded / 60)
    secondsNeeded = secondsNeeded - (minutesNeeded * 60)
    ns.printf("Level 300 requires class for %d min %d sec", minutesNeeded, secondsNeeded)
  */
}