import type {PlayerObject}         from '@/game_internal_types/PersonObjects/Player/PlayerObject';
import {exposeGameInternalObjects} from '@lib/exploits';
import {getAllServers}             from '@lib/scan_servers';
import {ServerSelections}          from '@settings';
import type {Server}               from 'NetscriptDefinitions';

if (!globalThis.NSNumbers) {
  exposeGameInternalObjects();
}

// TODO Just reimplement the format functions in our own code...
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
const formatNumber: (n: number, fractionalDigits?: number, suffixStart?: number, isInteger?: boolean) => string = globalThis.NSNumbers.formatNumber;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
const formatPercent: (n: number, fractionalDigits?: number, suffixStart?: number) => string = globalThis.NSNumbers.formatPercent;

const player = <PlayerObject>globalThis.Player;

// I would have preferred being able to just take a `Server` object
// and extend it, but I have to touch every property either way...
class ServerTargeting {
  #server: Server;

  /**
   * @param {Server} server
   */
  constructor(server: Server) {
    this.#server = server;
  }

  get hostname(): string { return this.#server.hostname; }

  get haveAdmin(): boolean { return this.#server.hasAdminRights; }

  get haveBackdoor(): boolean { return this.#server.backdoorInstalled; }

  get canBackdoor(): boolean { return this.#server.backdoorInstalled || this.#server.requiredHackingSkill <= player.skills.hacking; }

  get securityLevel(): number { return this.#server.hackDifficulty; }

  get securityMin(): number { return this.#server.minDifficulty; }

  get levelRequired(): number { return this.#server.requiredHackingSkill ?? 0; }

  get moneyAvailable(): number { return this.#server.moneyAvailable; }

  get moneyMax(): number { return this.#server.moneyMax; }

  get canHaveMoney(): boolean { return this.#server.moneyMax > 0; }

  static compareServer(a: ServerTargeting, b: ServerTargeting): number {
    // Sort by security, then money
    if (a.levelRequired === b.levelRequired) {
      if (a.securityMin === b.securityMin) {
        if (a.securityLevel === b.securityLevel) {
          if (a.moneyMax === b.moneyMax) {
            return b.moneyAvailable - a.moneyAvailable;
          } else {
            return b.moneyMax - a.moneyMax;
          }
        } else {
          return a.securityLevel - b.securityLevel;
        }
      } else {
        return a.securityMin - b.securityMin;
      }
    } else {
      return a.levelRequired - b.levelRequired;
    }
  }

  toString(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return globalThis.sprintf('%-18s HackLvl %4d BD %s MinSec %2s CurSec %6.3f  Value %8s / %8s ( %6s )',
      this.#server.hostname,
      this.#server.requiredHackingSkill ?? 0,
      this.haveBackdoor ? 'Y' : 'N',
      this.#server.minDifficulty,
      this.#server.hackDifficulty,
      formatNumber(this.#server.moneyAvailable),
      formatNumber(this.#server.moneyMax),
      formatPercent(this.#server.moneyAvailable / this.#server.moneyMax));
  }
}

export function main(ns: NS): void {

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
  const MINIMUM_LEVEL_REQUIRED = Math.min(LEVEL_THRESHOLD, player.skills.hacking * 0.4);

  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => ns.disableLog(log));


  const servers = getAllServers(ns);

  servers.map(s => new ServerTargeting(ns.getServer(s)))
    .filter(s => s.haveAdmin)
    .filter(s => s.canBackdoor)
    .filter(s => s.canHaveMoney)
    // Aim for hosts ~1/2 your hacking level; will need adjusted for later-game
    // Leave in our usual targets for easy reference
    .filter(s => MINIMUM_LEVEL_REQUIRED <= s.levelRequired || ServerSelections.goodTargets.includes(s.hostname))
    // eslint-disable-next-line @typescript-eslint/unbound-method
    .sort(ServerTargeting.compareServer)
    .forEach(s => {
      ns.tprintf('%s', s.toString());
    });
}
