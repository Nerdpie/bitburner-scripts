import {BuiltinServer}                        from "@lib/enum_and_limiter_definitions";
import {exposeGameInternalObjects}            from "@lib/exploits";
import {parseAutocompleteFlags, parseNsFlags} from "@lib/flags_util";
import {getAllServers}                        from "@lib/scan_servers";
import {ServerSelections}                     from "@settings";
import type {AutocompleteData, Server}        from "NetscriptDefinitions";

if (!globalThis.NSNumbers.formatNumber || !globalThis.NSNumbers.formatPercent || !globalThis.Player) {
  exposeGameInternalObjects();
}

if (!globalThis.NSNumbers.formatNumber || !globalThis.NSNumbers.formatPercent || !globalThis.Player) {
  throw new Error("Failed to expose game internal objects");
}

// TODO Just reimplement the format functions in our own code...
const formatNumber = globalThis.NSNumbers.formatNumber;
const formatPercent = globalThis.NSNumbers.formatPercent;

const player = globalThis.Player;

// TODO If we keep using this script, evaluate converting this from a class to just functions that act on `Server` objects
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

  get isPurchased(): boolean { return this.#server.purchasedByPlayer; }

  get haveAdmin(): boolean { return this.#server.hasAdminRights; }

  get haveBackdoor(): boolean { return this.#server.backdoorInstalled ?? false; }

  get canBackdoor(): boolean { return this.haveBackdoor || this.levelRequired <= player.skills.hacking; }

  get securityLevel(): number { return this.#server.hackDifficulty ?? 0; }

  get securityMin(): number { return this.#server.minDifficulty ?? 0; }

  get levelRequired(): number { return this.#server.requiredHackingSkill ?? 0; }

  get moneyAvailable(): number { return this.#server.moneyAvailable ?? 0; }

  get moneyMax(): number { return this.#server.moneyMax ?? 0; }

  get canHaveMoney(): boolean { return this.moneyMax > 0; }

  static compareServer(a: ServerTargeting, b: ServerTargeting): number {
    // Sort by security, then money
    if (a.levelRequired !== b.levelRequired) { return a.levelRequired - b.levelRequired; }
    if (a.securityMin !== b.securityMin) { return a.securityMin - b.securityMin; }
    if (a.securityLevel !== b.securityLevel) { return a.securityLevel - b.securityLevel; }
    if (a.moneyMax !== b.moneyMax) { return b.moneyMax - a.moneyMax; }
    return b.moneyAvailable - a.moneyAvailable;
  }

  toString(): string {
    const sprintf = globalThis.sprintf;
    return sprintf("%-18s HackLvl %4d BD %s MinSec %2s CurSec %6.3f  Value %8s / %8s ( %6s )",
      this.#server.hostname,
      this.levelRequired,
      this.haveBackdoor ? "Y" : "N",
      this.#server.minDifficulty,
      this.#server.hackDifficulty,
      formatNumber(this.moneyAvailable),
      formatNumber(this.moneyMax),
      formatPercent(this.moneyAvailable / this.moneyMax));
  }
}

const FLAGS_SCHEMA = {
  all: false,
};

export function main(ns: NS): void {

  const flags = parseNsFlags(ns, FLAGS_SCHEMA);

  const DISABLED_LOGS = [
    "getServerRequiredHackingLevel",
    "getHackingLevel",
    "getServerNumPortsRequired",
    "getScriptRam",
    "getServerMaxRam",
    "getServerUsedRam",
    "getServerMinSecurityLevel",
    "getServerMoneyAvailable",
    "scp",
    "scan",
    "exec",
  ];

  const LEVEL_THRESHOLD = flags.all ? 0 : 950;
  const MINIMUM_LEVEL_REQUIRED = Math.min(LEVEL_THRESHOLD, player.skills.hacking * 0.4);

  ns.disableLog("disableLog");
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  ns.tprintf("Target Finder");

  const servers = getAllServers(ns);

  // noinspection OverlyComplexBooleanExpressionJS
  servers.map(s => new ServerTargeting(ns.getServer(s)))
    .filter(s => !s.isPurchased
      && s.haveAdmin
      && s.canBackdoor
      && s.canHaveMoney
      // Aim for hosts ~1/2 your hacking level; will need adjusted for later-game
      && (MINIMUM_LEVEL_REQUIRED <= s.levelRequired ||
        // Leave in our usual targets for easy reference
        // The hostname of any non-purchased server should always be a valid BuiltinServer
        ServerSelections.goodTargets.includes(s.hostname as keyof typeof BuiltinServer)
      ))
    // eslint-disable-next-line @typescript-eslint/unbound-method
    .sort(ServerTargeting.compareServer)
    .forEach(s => {
      ns.tprintf("%s", s.toString());
    });
}

export function autocomplete(data: AutocompleteData): string[] {
  parseAutocompleteFlags(data, FLAGS_SCHEMA);
  return [];
}
