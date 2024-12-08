// Based on the script in `zac_hack`
// Pruned back to intentionally zero a server's cash

/** @param {NS} ns */
export async function main(ns) {

  const DISABLED_LOGS = [
    'getServerMoneyAvailable',
    'getServerMinSecurityLevel',
    'getServerSecurityLevel',
    'getServerMoneyAvailable',
    'weaken'
  ];

  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  let target = ns.args[0];
  let securityLevelMin;
  let securityLevelCurrent;
  let serverMoney = ns.getServerMoneyAvailable(target);

  while (serverMoney > 0) {
    securityLevelMin = ns.getServerMinSecurityLevel(target);
    securityLevelCurrent = ns.getServerSecurityLevel(target);

    ns.printf("%s security: %s / %s", target, ns.formatNumber(securityLevelCurrent), ns.formatNumber(securityLevelMin));

    // Yes, this slows down depletion, but we don't want to lock ourselves out...
    while (securityLevelCurrent > securityLevelMin + 5) {
      await ns.weaken(target);
      securityLevelCurrent = ns.getServerSecurityLevel(target);

      ns.printf("%s security weakened: %s / %s", target, ns.formatNumber(securityLevelCurrent), ns.formatNumber(securityLevelMin));
    }

    await ns.hack(target);
    serverMoney = ns.getServerMoneyAvailable(target);
    ns.printf("%s money: %e", target, serverMoney);
  }
}

export function autocomplete(data, args) {
  return data.servers;
}