import { getAllServers } from "servers/home/scripts/lib/scan_servers"
import { exposeGameInternalObjects } from "servers/home/scripts/lib/exploits"

let formatNumber;
let formatPercent;


// I would have preferred being able to just take a `Server` object
// and extend it, but I have to touch every property either way...
class ServerTargeting {
  /**
   * @param {Server} server
   */
  constructor(server) {
    this.#server = server;
  }

  /** @type {Server} */
  #server;

  /** @return {string} */
  hostname() { return this.#server.hostname }

  /** @return {boolean} */
  haveAdmin() { return this.#server.hasAdminRights }
  /** @return {boolean} */
  haveBackdoor() { return this.#server.backdoorInstalled || this.#server.requiredHackingSkill <= globalThis.Player.skills.hacking }
  /** @return {number} */
  securityLevel() { return this.#server.hackDifficulty }
  /** @return {number} */
  securityMin() { return this.#server.minDifficulty }

  /** @return {number} */
  levelRequired() { return this.#server.requiredHackingSkill ?? 0 }

  /** @return {number} */
  moneyAvailable() { return this.#server.moneyAvailable }
  /** @return {number} */
  moneyMax() { return this.#server.moneyMax }
  /** @return {boolean} */
  canHaveMoney() { return this.#server.moneyMax > 0 }

  /**
   * @param {ServerTargeting} a
   * @param {ServerTargeting} b
   * @return {number}
   */
  static compareServer(a, b) {
    // Sort by security, then money
    if (a.levelRequired() == b.levelRequired()) {
      if (a.securityMin() == b.securityMin()) {
        if (a.securityLevel() == b.securityLevel()) {
          if (a.moneyMax() == b.moneyMax()) {
            return b.moneyAvailable() - a.moneyAvailable();
          } else {
            return b.moneyMax() - a.moneyMax();
          }
        } else {
          return a.securityLevel() - b.securityLevel();
        }
      } else {
        return a.securityMin() - b.securityMin();
      }
    } else {
      return a.levelRequired() - b.levelRequired()
    }
  }

  toString() {
    return vsprintf('%-18s HackLvl %4d BD %s MinSec %2s CurSec %6.3f  Value %8s / %8s ( %6s )',
      [this.#server.hostname,
      this.#server.requiredHackingSkill ?? 0,
      this.haveBackdoor() ? 'Y' : 'N',
      this.#server.minDifficulty,
      this.#server.hackDifficulty,
      formatNumber(this.#server.moneyAvailable),
      formatNumber(this.#server.moneyMax),
      formatPercent(this.#server.moneyAvailable / this.#server.moneyMax)]);
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const DISABLED_LOGS = [
    'getServerRequiredHackingLevel',
    'getHackingLevel',
    'getServerNumPortsRequired',
    'getScriptRam',
    'getServerMaxRam',
    'getServerUsedRam',
    'getServerMinSecurityLevel',
    'getServerMoneyAvailable',
    'scp',
    'scan',
    'exec'
  ];

  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  if (!globalThis.NSNumbers.formatNumber) {
    exposeGameInternalObjects();
  }

  formatNumber = globalThis.NSNumbers.formatNumber;
  formatPercent = globalThis.NSNumbers.formatPercent;

  let servers = getAllServers(ns);

  servers.map(s => new ServerTargeting(ns.getServer(s)))
    .filter(s => s.haveAdmin())
    .filter(s => s.haveBackdoor())
    .filter(s => s.canHaveMoney())
    // Aim for hosts ~1/2 your hacking level; will need adjusted for later-game
    .filter(s => Math.min(950, globalThis.Player.skills.hacking * 0.4) <= s.levelRequired())
    .sort(ServerTargeting.compareServer)
    .forEach(s => {
      ns.tprintf("%s", s.toString());
    })
}
