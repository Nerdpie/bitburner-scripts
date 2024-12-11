export async function main(ns: NS): Promise<void> {
  const args = ns.args;
  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    await ns.weaken(<string>args[0]);
  }
}