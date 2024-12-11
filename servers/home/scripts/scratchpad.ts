import {ScriptSettings} from "@/servers/home/scripts/settings"
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits"
import {Player} from "NetscriptDefinitions";
import {sprintf} from "sprintf-js";


/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  ns.tail();
  ns.clearLog();

  const config = ScriptSettings.scratchpad;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);



  // Lame way to avoid having code purged from the scratchpad, but not executed
  const HUSH_IM_BUSY: number = -1

  if (HUSH_IM_BUSY === 1) {
    const contractNum = 161265
    const contractGroup = ''
    // noinspection SpellCheckingInspection - In-game servers have irregular names
    const hostname = 'syscore'

    const contractName = `contract-${contractNum}${contractGroup === '' ? '' : '-' + contractGroup}.cct`;
    ns.print(ns.codingcontract.getData(contractName, hostname))

  } else if (HUSH_IM_BUSY === 2) {

    if (!globalThis.Companies) {
      exposeGameInternalObjects()
    }

    if (ns.fileExists('Formulas.exe', 'home')) {
      function calcFavorAfterReset(favor: number, rep: number): number {
        return ns.formulas.reputation.calculateRepToFavor(ns.formulas.reputation.calculateFavorToRep(favor) + rep);
      }

      globalThis.Companies.metadata.filter(c => c.playerReputation > 0 || c.favor > 8)
        .forEach(c => {
          //ns.print(sprintf('%-20s  Rep: %7d  Favor %4d', c.name, c.playerReputation, c.favor))
          ns.print(sprintf('%-20s  Favor %4d', c.name, calcFavorAfterReset(c.favor, c.playerReputation)))
        })
    }
  } else if (HUSH_IM_BUSY === 3) {
    const SECONDS_PER_MINUTE = 60;

    const me: Player = ns.getPlayer();

    const chaLvl = me.skills.charisma;
    const chaExp = me.exp.charisma;
    const chaLvlMult = me.mults.charisma;
    const chaExpMult = me.mults.charisma_exp;
    const expForLevel300 = ns.formulas.skills.calculateExp(300, chaLvlMult);
    const expDiff = expForLevel300 - chaExp;
    const gainPerCycle = ns.formulas.work.universityGains(me, "Leadership", "Rothman University");
    const gainPerSec = gainPerCycle.chaExp * 5;
    ns.printf("expDiff: %d", expDiff)
    ns.printf("gainPerSec: %d", gainPerSec)
    let secondsNeeded = expDiff / gainPerSec;
    const minutesNeeded = Math.floor(secondsNeeded / SECONDS_PER_MINUTE);
    secondsNeeded -= (minutesNeeded * SECONDS_PER_MINUTE)
    ns.printf("Level 300 requires class for %d min %d sec", minutesNeeded, secondsNeeded)
  }
}