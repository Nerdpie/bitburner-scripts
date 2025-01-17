/**
 * Script to iterate over hosts and list discovered files
 */

import {parseAutocompleteFlags, parseNsFlags} from "@lib/flags_util";
import {getAllServers}                        from "@lib/scan_servers";
import type {AutocompleteData}                from "NetscriptDefinitions";

function isIgnored(file: string) {
  const IGNORE_PATTERNS = [
    "scripts/",
  ];
  return IGNORE_PATTERNS.some(pat => file.match(pat) !== null);
}

const FLAGS_SCHEMA = {
  "includeHome": false,
  "scrape": false,
};

export function main(ns: NS) {
  const DISABLED_LOGS = [
    "scan",
  ];

  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const flags = parseNsFlags(ns, FLAGS_SCHEMA);

  let servers = getAllServers(ns);

  if (!flags.includeHome) {
    servers = servers.filter(s => "home" !== s);
  }

  if (flags.scrape) {
    servers.forEach(server => {
      const files = ns.ls(server).filter(f => f.endsWith(".lit"));

      ns.scp(files, "home", server);
    });
  } else {
    servers.forEach(server => {
      const files = ns.ls(server).filter(f => !isIgnored(f));

      if (files.length > 0) {
        ns.tprintf("|-- %s", server);
        files.forEach(file => ns.tprintf("  - %s", file));
      }
    });
  }

}

export function autocomplete(data: AutocompleteData): string[] {
  parseAutocompleteFlags(data, FLAGS_SCHEMA);
  return [];
}
