import type {AutocompleteData} from "NetscriptDefinitions";

export async function main(ns: NS): Promise<void> {
  const args = ns.args;
  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    await ns.weaken((args[0] as string));
  }
}

export function autocomplete(data: AutocompleteData): string[] {
  return data.servers;
}
