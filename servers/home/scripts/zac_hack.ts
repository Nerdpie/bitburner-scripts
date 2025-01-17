/**
 * Modified from Guide posted by Zac Starfire
 * Found at https://steamcommunity.com/sharedfiles/filedetails/?id=2860828429
 *
 * Nerdpie's tweaks:
 * Added `disableLog` block to clean up console
 * Added customized logging
 */

import type {AutocompleteData} from "NetscriptDefinitions";

/** Helper function to write the money values */
function logMoney(ns: NS, target: string, moneyCurrent: number, moneyMax: number): void {
  ns.printf("%s money: %s / %s", target, ns.formatNumber(moneyCurrent), ns.formatNumber(moneyMax));
}

export async function main(ns: NS): Promise<void> {
  const DISABLED_LOGS = [
    "getServerMoneyAvailable",
    "getServerMaxMoney",
    "getServerMinSecurityLevel",
    "getServerSecurityLevel",
    "getServerMoneyAvailable",
    "weaken",
  ];

  ns.disableLog("disableLog");
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const target: string = ns.args[0] as string;
  let securityLevelMin: number;
  let securityLevelCurrent: number;
  let serverMoneyMax: number;
  let serverMoneyAvailable: number;

  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    securityLevelMin = ns.getServerMinSecurityLevel(target);
    securityLevelCurrent = ns.getServerSecurityLevel(target);

    ns.printf("%s security: %s / %s", target, ns.formatNumber(securityLevelCurrent), ns.formatNumber(securityLevelMin));

    while (securityLevelCurrent > securityLevelMin + 5) {
      await ns.weaken(target);
      securityLevelCurrent = ns.getServerSecurityLevel(target);

      ns.printf("%s security weakened: %s / %s", target, ns.formatNumber(securityLevelCurrent), ns.formatNumber(securityLevelMin));
    }

    serverMoneyAvailable = ns.getServerMoneyAvailable(target);
    serverMoneyMax = ns.getServerMaxMoney(target);
    logMoney(ns, target, serverMoneyAvailable, serverMoneyMax);

    // noinspection MagicNumberJS
    while (serverMoneyAvailable < (serverMoneyMax * 0.75)) {
      await ns.grow(target);
      serverMoneyAvailable = ns.getServerMoneyAvailable(target);
      serverMoneyMax = ns.getServerMaxMoney(target);

      logMoney(ns, target, serverMoneyAvailable, serverMoneyMax);
    }

    await ns.hack(target);
    serverMoneyAvailable = ns.getServerMoneyAvailable(target);
    serverMoneyMax = ns.getServerMaxMoney(target);

    logMoney(ns, target, serverMoneyAvailable, serverMoneyMax);
  }
}

export function autocomplete(data: AutocompleteData): string[] {
  return data.servers;
}
