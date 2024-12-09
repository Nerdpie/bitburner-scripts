export async function main(ns: NS): Promise<void> {
  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    await ns.share();
  }
}