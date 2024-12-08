/** @param {NS} ns */
export async function main(ns) {
  let args = ns.args;
  while (true) {
    await ns.grow(args[0]);
  }
}