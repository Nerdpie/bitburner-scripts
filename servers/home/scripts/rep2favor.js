import { repToFavor } from "servers/home/scripts/lib/favor"

/** @param {NS} ns */
export async function main(ns) {
  let rep = ns.args[0];

  ns.tprintf('Rep: %s => Favor: %s', ns.formatNumber(rep), ns.formatNumber(repToFavor(rep)));
}