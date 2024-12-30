/**
 * Script to iterate over hosts and list discovered files
 */

import { getAllServers } from "@lib/scan_servers"

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

  const flags = ns.flags([['includeHome', false], ['scrape', false]]);

  let servers = getAllServers(ns);

  if (!flags.includeHome) {
    servers = servers.filter(s => !['home'].includes(s));
  }

  if (flags.scrape) {
    servers.forEach(server => {
      const files = ns.ls(server).filter(f => f.endsWith(".lit"));

      ns.scp(files, 'home', server);
    })
  } else {
    servers.forEach(server => {
      const files = ns.ls(server).filter(f => !isIgnored(f));

      if (files.length > 0) {
        ns.tprintf('|-- %s', server);
        files.forEach(file => ns.tprintf('  - %s', file));
      }
    })
  }

}