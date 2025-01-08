// noinspection IfStatementWithTooManyBranchesJS

import type {Company}              from "@/game_internal_types/Company/Company";
import type {CompanyName}          from "@/game_internal_types/Enums";
import {exposeGameInternalObjects} from "@lib/exploits";
import {getAllServers}             from "@lib/scan_servers";
import {Scratchpad, setTailWindow} from "@settings";
import type {Player}               from "NetscriptDefinitions";

/** @param {NS} ns */
export function main(ns: NS): void {
  setTailWindow(ns, Scratchpad);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sprintf = globalThis.sprintf as (format: string, ...args: any[]) => string;

  // Lame way to avoid having code purged from the scratchpad, but not executed
  const HUSH_IM_BUSY: number = -1;

  if (HUSH_IM_BUSY === 1) {

    if (!globalThis.Companies) {
      exposeGameInternalObjects();
    }

    const companies = <Record<CompanyName, Company>>globalThis.Companies;

    if (ns.fileExists("Formulas.exe", "home")) {
      function calcFavorAfterReset(favor: number, rep: number): number {
        return ns.formulas.reputation.calculateRepToFavor(ns.formulas.reputation.calculateFavorToRep(favor) + rep);
      }

      Object.values(companies).filter(c => c.playerReputation > 0 || c.favor > 8)
        .forEach(c => {
          //ns.print(sprintf('%-20s  Rep: %7d  Favor %4d', c.name, c.playerReputation, c.favor))
          ns.print(sprintf("%-20s  Favor %4d", c.name, calcFavorAfterReset(c.favor, c.playerReputation)));
        });
    }
  } else if (HUSH_IM_BUSY === 2) {
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
    ns.printf("expDiff: %d", expDiff);
    ns.printf("gainPerSec: %d", gainPerMillisecond * 1000);
    const millisecondsNeeded = expDiff / gainPerMillisecond;

    ns.printf("Level %d requires class for %s", TARGET_LEVEL, ns.tFormat(millisecondsNeeded));
  } else if (HUSH_IM_BUSY === 3) {
    const servers = getAllServers(ns);

    servers.map((s) => {return {org: ns.getServer(s).organizationName, hostname: s};})
      .sort((a, b) => a.hostname.localeCompare(b.hostname))
      .sort((a, b) => a.org.localeCompare(b.org))
      .forEach(n => ns.printf(`Org: ${n.org}\n  Host: ${n.hostname}`));
  }
}
