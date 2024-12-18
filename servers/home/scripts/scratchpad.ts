import {Scratchpad, setTailWindow} from "@/servers/home/scripts/settings"
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits"
import {Player} from "NetscriptDefinitions";
import {sprintf} from "sprintf-js";
import {CodingContractTypes} from "@/servers/home/scripts/coding_contracts/contract_util";


/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  setTailWindow(ns, Scratchpad);

  //ns.codingcontract.createDummyContract(CodingContractTypes["Algorithmic Stock Trader IV"])

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
  }
}