import { getAllServers } from "@/servers/home/scripts/lib/scan_servers"
import { exposeGameInternalObjects } from "@/servers/home/scripts/lib/exploits"
import {sprintf} from "sprintf-js";
import {Server} from "NetscriptDefinitions";

let formatNumber;
let formatPercent;


// I would have preferred being able to just take a `Server` object
// and extend it, but I have to touch every property either way...
class ServerTargeting {
  /**
   * @param {Server} server
   */
  constructor(server: Server) {
    this.#server = server;
  }

  #server: Server;

  hostname(): string { return this.#server.hostname }

  haveAdmin(): boolean { return this.#server.hasAdminRights }
  haveBackdoor(): boolean { return this.#server.backdoorInstalled || this.#server.requiredHackingSkill <= globalThis.Player.skills.hacking }
  securityLevel(): number { return this.#server.hackDifficulty }
  securityMin(): number { return this.#server.minDifficulty }

  levelRequired(): number { return this.#server.requiredHackingSkill ?? 0 }

  moneyAvailable(): number { return this.#server.moneyAvailable }
  moneyMax(): number { return this.#server.moneyMax }
  canHaveMoney(): boolean { return this.#server.moneyMax > 0 }

  static compareServer(a: ServerTargeting, b: ServerTargeting): number {
    // Sort by security, then money
    if (a.levelRequired() === b.levelRequired()) {
      if (a.securityMin() === b.securityMin()) {
        if (a.securityLevel() === b.securityLevel()) {
          if (a.moneyMax() === b.moneyMax()) {
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

  toString(): string {
    return sprintf('%-18s HackLvl %4d BD %s MinSec %2s CurSec %6.3f  Value %8s / %8s ( %6s )',
      this.#server.hostname,
      this.#server.requiredHackingSkill ?? 0,
      this.haveBackdoor() ? 'Y' : 'N',
      this.#server.minDifficulty,
      this.#server.hackDifficulty,
      formatNumber(this.#server.moneyAvailable),
      formatNumber(this.#server.moneyMax),
      formatPercent(this.#server.moneyAvailable / this.#server.moneyMax));
  }
}

export async function main(ns: NS): Promise<void> {

  const flags = ns.flags([['all', false]]);

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

  const LEVEL_THRESHOLD = <boolean>flags.all ? 0 : 950;

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
    .filter(s => Math.min(LEVEL_THRESHOLD, globalThis.Player.skills.hacking * 0.4) <= s.levelRequired())
    .sort(ServerTargeting.compareServer)
    .forEach(s => {
      ns.tprintf("%s", s.toString());
    })
}
