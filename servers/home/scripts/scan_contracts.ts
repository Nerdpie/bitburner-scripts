/**
 * Script to iterate over hosts and list contracts
 */

import { ScriptSettings } from "@/servers/home/scripts/settings"
import { getAllServers } from "@/servers/home/scripts/lib/scan_servers"

function isIgnored(file) {

  const IGNORE_PATTERNS = [
    'scripts/'
  ]

  return IGNORE_PATTERNS.some(pat => file.match(pat))
}

/** @param {NS} ns */
export async function main(ns) {
  const DISABLED_LOGS = [
    'scan'
  ];

  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  let servers = getAllServers(ns);

  // We want to have contracts in a `tail` window for reference
  ns.clearLog();
  ns.tail();

  let config = ScriptSettings.contracts;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  servers.forEach(server => {
    let files = ns.ls(server).filter(f => !isIgnored(f));

    files = files.filter(f => f.endsWith('.cct'));

    if (files.length > 0) {
      ns.printf('|-- %s', server);
      files.forEach(file => ns.printf('  - %s', file));
    }
  })
}