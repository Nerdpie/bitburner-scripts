/**
 * Modified from Guide posted by Zac Starfire
 * Found at https://steamcommunity.com/sharedfiles/filedetails/?id=2860828429
 * 
 * Nerdpie's tweaks:
 * Added `disableLog` block to clean up console
 * Added customized logging
 */

/** Helper function to write the money values */
async function logMoney(ns, target, moneyCurrent, moneyMax) {
  ns.printf('%s money: %s / %s', target, ns.formatNumber(moneyCurrent), ns.formatNumber(moneyMax));
}

/** @param {NS} ns */
export async function main(ns) {
  const DISABLED_LOGS = [
    'getServerMoneyAvailable',
    'getServerMaxMoney',
    'getServerMinSecurityLevel',
    'getServerSecurityLevel',
    'getServerMoneyAvailable',
    'weaken'
  ];

  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  let target = ns.args[0];
  let securityLevelMin;
  let securityLevelCurrent;
  let serverMoneyMax;
  let serverMoneyAvailable;

  while (true) {
    securityLevelMin = ns.getServerMinSecurityLevel(target);
    securityLevelCurrent = ns.getServerSecurityLevel(target);

    ns.printf("%s security: %s / %s", target, ns.formatNumber(securityLevelCurrent), ns.formatNumber(securityLevelMin));

    while (securityLevelCurrent > securityLevelMin + 5) {
      await ns.weaken(target);
      securityLevelCurrent = ns.getServerSecurityLevel(target)

      ns.printf("%s security weakened: %s / %s", target, ns.formatNumber(securityLevelCurrent), ns.formatNumber(securityLevelMin));
    }

    serverMoneyAvailable = ns.getServerMoneyAvailable(target);
    serverMoneyMax = ns.getServerMaxMoney(target);
    await logMoney(ns, target, serverMoneyAvailable, serverMoneyMax);

    while (serverMoneyAvailable < (serverMoneyMax * 0.75)) {
      await ns.grow(target);
      serverMoneyAvailable = ns.getServerMoneyAvailable(target);
      serverMoneyMax = ns.getServerMaxMoney(target);

      await logMoney(ns, target, serverMoneyAvailable, serverMoneyMax);
    }

    await ns.hack(target);
    serverMoneyAvailable = ns.getServerMoneyAvailable(target)
    serverMoneyMax = ns.getServerMaxMoney(target);

    await logMoney(ns, target, serverMoneyAvailable, serverMoneyMax);
  }
}

export function autocomplete(data, args) {
  return data.servers;
}