import type {AutocompleteData} from "NetscriptDefinitions";

export async function main(ns: NS): Promise<void> {
  const args = ns.args;
  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    await ns.grow(<string>args[0]);
  }
}

export function autocomplete(data: AutocompleteData): string[] {
  return data.servers;
}
