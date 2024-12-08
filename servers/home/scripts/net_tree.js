import { scanAnalyzeInternals } from "servers/home/scripts/lib/scan_servers"
import { ScriptSettings } from "servers/home/scripts/settings"

/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  ns.clearLog();

  let config = ScriptSettings.net_tree;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  ns.disableLog('disableLog');
  ns.disableLog('scan');
  scanAnalyzeInternals(ns, 20);
}