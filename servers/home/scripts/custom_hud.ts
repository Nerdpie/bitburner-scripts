export async function main(ns: NS): Promise<void> {

  const DISABLED_LOGS = [
    'sleep'
  ];
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const args = ns.flags([["help", false]]);
  if (args.help) {
    ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
    ns.tprint(`Usage: run ${ns.getScriptName()}`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()}`);
    return;
  }

  const doc = eval('document');
  const hook0 = doc.getElementById('overview-extra-hook-0');
  const hook1 = doc.getElementById('overview-extra-hook-1');
  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    try {
      const headers = []
      const values = [];

      headers.push("SharePower");
      values.push(ns.formatNumber(ns.getSharePower()))

      headers.push("Karma");
      values.push(ns.formatNumber(ns.heart.break()));

      headers.push("Kills");
      values.push(ns.getPlayer().numPeopleKilled);

      headers.push("Time");
      values.push(new Date().toLocaleTimeString([], { hour12: false, hourCycle: 'h23' }));

      // Now drop it into the placeholder elements
      hook0.innerText = headers.join("\n");
      hook1.innerText = values.join("\n");
    } catch (err) { // This might come in handy later
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
  }
}