// Copied from https://steamcommunity.com/sharedfiles/filedetails/?id=3241603650
import {ScriptSettings} from "@/servers/home/scripts/settings"

/**
 * This function automates the management of hacknet nodes in a game,
 * where nodes can be purchased or upgraded to enhance their performance.
 * It runs indefinitely, checking if enough funds are available to perform upgrades
 * or purchase new nodes, and executing these actions when possible.
 *
 * @param {NS} ns - The namespace object provided by the game, which includes
 *                       functions for interacting with the game's systems.
 * @async
 */
export async function main(ns: NS): Promise<void> {
  // Log settings: Disable verbose logging for the specified function.
  const DISABLED_LOGS = ['getServerMoneyAvailable'];
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  // Opens a tail window in the game to display log outputs.
  ns.tail();
  ns.clearLog();

  const config = ScriptSettings.hacknet_manager;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  /** Cap on the amount to spend */
  const MAX_PRICE: number = config.maxPrice || Number.MAX_SAFE_INTEGER;

  // LOOP_DELAY: Time in milliseconds to wait when funds are insufficient for upgrades.
  // Default value is 3000 milliseconds (3 seconds).
  const LOOP_DELAY: number = config.loopDelay || 1000 * 3;

  // THRESHOLD: Multiplier to determine the minimum funds needed relative to the cost of the next upgrade.
  // Default value is 1000, i.e., funds must be at least 1000 times the upgrade cost.
  const THRESHOLD: number = config.threshold || 1000;

  // CALCULATION_DELAY: Time in milliseconds to delay after executing an upgrade,
  // intended to manage load on system resources. Default value is 5 milliseconds.
  const CALCULATION_DELAY = 5;

  // Ensure we don't burn our cash before we get the dark web
  if (!ns.hasTorRouter()) {
    ns.print('Tor router not yet purchased')

    while (!ns.hasTorRouter()) {
      await ns.sleep(10 * 1000);
    }
  }

  // Continuously loop to manage node upgrades or purchases.
  while (true) {
    const owned_nodes: number = ns.hacknet.numNodes();  // Get the current number of owned nodes.
    let min_cost: number = ns.hacknet.getPurchaseNodeCost();  // Cost of purchasing a new node.
    let node_index: number = owned_nodes;  // Index for node to upgrade, initialized to the next new node.
    let upgrade_type: number = -1;  // Type of upgrade to perform: -1 for purchase, 0 for level, 1 for RAM, 2 for core.

    // Evaluate the cost and type of the cheapest possible upgrade among existing nodes.
    for (let i = 0; i < owned_nodes; i++) {
      const upgrades: number[] = [
        ns.hacknet.getLevelUpgradeCost(i, 1),
        ns.hacknet.getRamUpgradeCost(i, 1),
        ns.hacknet.getCoreUpgradeCost(i, 1)
      ];

      const new_cost: number = Math.min.apply(Math, upgrades);
      if (new_cost < min_cost) {
        min_cost = new_cost;
        node_index = i;
        upgrade_type = upgrades.indexOf(new_cost);
      }
    }

    if (MAX_PRICE <= min_cost) {
      ns.printf("Max price (%s) exceeded: %s", ns.formatNumber(MAX_PRICE), ns.formatNumber(min_cost));
      break;
    }

    // Wait until there are sufficient funds for the selected upgrade.
    while (ns.getServerMoneyAvailable("home") < min_cost * THRESHOLD) {
      ns.printf("Node %d needs %s * %d for next upgrade.", node_index, ns.formatNumber(min_cost), THRESHOLD);
      await ns.sleep(LOOP_DELAY);
    }

    // Execute the selected upgrade or node purchase.
    switch (upgrade_type) {
      case -1:
        ns.hacknet.purchaseNode();
        ns.printf("Purchased a new hacknet node.");
        break;
      case 0:
        ns.hacknet.upgradeLevel(node_index, 1);
        ns.printf("Upgraded node %d's level.", node_index);
        break;
      case 1:
        ns.hacknet.upgradeRam(node_index, 1);
        ns.printf("Upgraded node %d's ram.", node_index);
        break;
      case 2:
        ns.hacknet.upgradeCore(node_index, 1);
        ns.printf("Upgraded node %d's cores.", node_index);
        break;
    }

    // Delay after upgrade to manage system performance.
    await ns.sleep(CALCULATION_DELAY);
  }
}
