import type {AutocompleteData} from "NetscriptDefinitions";

// Simple, EXTREMELY unoptimized script to prep a server

export async function main(ns: NS): Promise<void> {
  const args = ns.args;

  if (args.length === 0 || typeof args[0] !== "string") {
    throw new Error(`${ns.self().filename} requires a target server as a string`);
  }

  const hostname = args[0];
  const minSecurity = ns.getServerMinSecurityLevel(hostname);
  const maxMoney = ns.getServerMaxMoney(hostname);

  let curSecurity = ns.getServerSecurityLevel(hostname);
  let curMoney = ns.getServerMoneyAvailable(hostname);

  while (curMoney < maxMoney || minSecurity < curSecurity) {
    // Yes, this wastes cycles weakening, but for a naive implementation,
    // it will work better on higher-level servers than letting the security level spike.
    // Also saves the overhead of embedding the ratio calculations.
    while (minSecurity < curSecurity) {
      await ns.weaken(hostname);
      curSecurity = ns.getServerSecurityLevel(hostname);
    }

    await ns.grow(hostname);
    curMoney = ns.getServerMoneyAvailable(hostname);
    curSecurity = ns.getServerSecurityLevel(hostname);
  }
}

export function autocomplete(data: AutocompleteData): string[] {
  return data.servers;
}
