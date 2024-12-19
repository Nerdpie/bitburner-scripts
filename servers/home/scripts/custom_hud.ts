export async function main(ns: NS): Promise<void> {

  const DISABLED_LOGS = [
    'sleep'
  ];
  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const args = ns.flags([["help", false]]);
  if (args.help) {
    ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
    ns.tprint(`Usage: run ${ns.getScriptName()}`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()}`);
    return;
  }

  const doc = globalThis['document'];
  const hook0 = doc.getElementById('overview-extra-hook-0');
  const hook1 = doc.getElementById('overview-extra-hook-1');
  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    try {
      const headers = []
      const values = [];

      headers.push("Time");
      values.push(new Date().toLocaleTimeString([], { hour12: false, hourCycle: 'h23' }));

      headers.push("SharePower");
      values.push(ns.formatNumber(ns.getSharePower()))

      headers.push("Karma");
      values.push(ns.formatNumber(ns.heart.break()));

      headers.push("Kills");
      values.push(ns.getPlayer().numPeopleKilled);

      if ( ns.gang.inGang()) {
        const gangInfo = ns.gang.getGangInformation();

        headers.push("=== Gang ===");
        values.push(" ");

        headers.push("Respect");
        values.push(ns.formatNumber(gangInfo.respect));

        headers.push("Wanted Penalty");
        values.push(ns.formatPercent(1 - gangInfo.wantedPenalty));

        headers.push("Power");
        values.push(ns.formatNumber(gangInfo.power));

        headers.push("Territory");
        values.push(ns.formatPercent(gangInfo.territory));

        headers.push("Clash Chance");
        values.push(ns.formatPercent(gangInfo.territoryClashChance));
      }

      // Now drop it into the placeholder elements
      hook0.innerText = headers.join("\n");
      hook1.innerText = values.join("\n");
    } catch (err) { // This might come in handy later
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
  }
}