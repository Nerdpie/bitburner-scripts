// Based originally on the guide at https://steamcommunity.com/sharedfiles/filedetails/?id=3241603650

import {BackdoorConcat, Deploy, setTailWindow} from "@/servers/home/scripts/settings"
import {getAllServers} from "@/servers/home/scripts/lib/scan_servers"
import {Server} from "NetscriptDefinitions";
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits";

const config = Deploy;

function getAvailableTools(ns: NS): ((host: string) => void)[] {
  const PROGRAMS: ({ file: string; action: (host: string) => void })[] = [
    {file: "BruteSSH.exe", action: ns.brutessh},
    {file: "FTPCrack.exe", action: ns.ftpcrack},
    {file: "RelaySMTP.exe", action: ns.relaysmtp},
    {file: "HTTPWorm.exe", action: ns.httpworm},
    {file: "SQLInject.exe", action: ns.sqlinject}
  ];

  const availableTools: ((host: string) => void)[] = [];

  PROGRAMS.forEach(program => {
    if (ns.fileExists(program.file)) {
      availableTools.push(program.action);
    }
  })

  return availableTools;
}

function pwnServer(ns: NS, target: Server, tools: ((host: string) => void)[]) {
  // Don't waste cycles if we already own the box
  if (target.hasAdminRights) {
    tryBackdoor(ns, target)
    return true;
  }

  let openPorts = 0;
  tools.forEach(tool => {
    tool(target.hostname);
    openPorts++;
  })

  if (target.numOpenPortsRequired <= openPorts) {
    ns.nuke(target.hostname);
    ns.printf('Target pwned: %s', target.hostname);

    tryBackdoor(ns, target)
    return true;
  }

  return false;
}

/**
 * @param {NS} ns
 * @param {Server} server
 */
function tryBackdoor(ns: NS, server: Server) {
  // Revisit when we have Singularity access ... or not
  if (!server.backdoorInstalled
    && !server.purchasedByPlayer
    && server.requiredHackingSkill <= ns.getHackingLevel()) {
    try {
      // Make sure the Terminal isn't busy with another action
      if (globalThis.Terminal.action === null) {
        globalThis.Terminal.connectToServer(server.hostname);
        globalThis.Terminal.executeCommands('backdoor');
      } else if (BackdoorConcat.includes(server.hostname)
        || Deploy.targetServer === server.hostname) {
        // In our 'make sure we bd' list
        ns.printf('Need to backdoor: %s', server.hostname);
      }
    } catch {
      if (BackdoorConcat.includes(server.hostname)
        || Deploy.targetServer === server.hostname) {
        // In our 'make sure we bd' list
        ns.printf('Need to backdoor: %s', server.hostname);
      }
    }
  }
}

function execScript(ns: NS, server: string, script: string, targetServer?: string): void {
  const ramCost = ns.getScriptRam(script, server);

  let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  if ('home' === server) {
    ramAvailable -= config.homeReservedRam;
  }

  const numThreads = Math.floor(ramAvailable / ramCost);
  if (numThreads > 0) {
    if (targetServer) {
      ns.exec(script, server, numThreads, targetServer);
    } else {
      ns.exec(script, server, numThreads)
    }
  }
}

function buildCluster(ns: NS) {
  // noinspection OverlyComplexBooleanExpressionJS - Abusing boolean expression to short-circuit if low on funds
  buyServers(ns, 'cluster-', config.clusterCount) &&
  buyServers(ns, 'weaken-', config.weakenCount) &&
  buyServers(ns, 'grow-', config.growCount) &&
  buyServers(ns, 'share-', config.shareCount)
}

/**
 * Attempts to buy/upgrades servers
 * @param ns
 * @param prefix
 * @param count
 * @returns Whether all requested servers were bought/upgraded
 */
function buyServers(ns: NS, prefix: string, count: number): boolean {
  const RAM_CAPACITY = config.ramCapacity;
  const PRICE = ns.getPurchasedServerCost(RAM_CAPACITY);
  for (let i = 0; i < count; i++) {
    const serverName = prefix + i;
    if (ns.serverExists(serverName)) {
      // Check if the server's RAM is at the current target
      if (ns.getServerMaxRam(serverName) < RAM_CAPACITY) {
        if (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerUpgradeCost(serverName, RAM_CAPACITY)) {
          ns.printf("Insufficient funds to upgrade %s", serverName);
          return false;
        }
        ns.upgradePurchasedServer(serverName, RAM_CAPACITY);
      }
    } else {
      if (ns.getServerMoneyAvailable('home') < PRICE) {
        ns.printf("Insufficient funds to buy %s", serverName)
        return false;
      }
      ns.purchaseServer(serverName, RAM_CAPACITY);
    }
  }
  return true;
}

function sortBackdoorPriority(a: Server, b: Server): number {
  // Make sure we hit our target server FIRST
  if (Deploy.targetServer === a.hostname) {
    return -1;
  } else if (Deploy.targetServer === b.hostname) {
    return 1;
  }

  const backdoorSoonA = BackdoorConcat.includes(a.hostname);
  const backdoorSoonB = BackdoorConcat.includes(b.hostname);

  if (backdoorSoonA === backdoorSoonB) {
    return (a.requiredHackingSkill ?? 0) - (b.requiredHackingSkill ?? 0);
  }

  // They are NOT the same priority; if `a` has priority, return -1 (first in sort order)
  if (backdoorSoonA) {
    return -1;
  }
  return 1;
}

function isAnotherInstanceRunning(ns: NS): boolean {
  const self = ns.self();
  return ns.ps().some(v => v.pid !== self.pid && v.filename === self.filename)
}

/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  if (isAnotherInstanceRunning(ns)) {
    return;
  }

  setTailWindow(ns, config);

  ns.disableLog('disableLog'); // Ironic, no?
  ns.disableLog('ALL');

  const MAX_LOG_LINES = 25;

  let tools: ((host: string) => void)[];
  let script: string;

  let targetSelf = config.targetSelf;
  // noinspection ES6ConvertLetToConst - Need to rework this to be dynamic ANYWAY...
  let targetServer = config.targetServer;
  let resetScripts = config.resetScripts;

  switch (config.mode) {
    case 'share':
      script = '/scripts/share.js';
      break;
    case 'hgw':
      script = '/scripts/zac_hack.js';
      break;
    default:
      ns.print("WARNING: Invalid mode '" + config.mode + "' - defaulting to 'hgw'")
      script = '/scripts/zac_hack.js';
  }

  const filesToCopy = [
    script,
    '/scripts/weaken.js',
    '/scripts/grow.js',
    '/scripts/share.js'
  ];

  if (!targetSelf && !ns.getServer(targetServer).backdoorInstalled) {
    ns.printf('Target server not yet pwned - %s', targetServer);
    targetSelf = true;
  }

  if (!globalThis.Terminal) {
    exposeGameInternalObjects();
  }

  // noinspection InfiniteLoopJS - Intended design
  while (true) {
    ns.printf('Looping at %s', new Date(Date.now()).toLocaleString());

    buildCluster(ns)

    // Check inside the loop in case we unlock more tools
    tools = getAvailableTools(ns);

    if (resetScripts) {
      ns.print("Killing running scripts")
    }

    const purchasedServers = ns.getPurchasedServers();
    getAllServers(ns)
      .filter(s => (s !== 'home'))
      .filter(s => !purchasedServers.includes(s))
      .map(s => ns.getServer(s))
      .sort(sortBackdoorPriority)
      .filter(s => pwnServer(ns, s, tools))
      .forEach(server => {
        if (resetScripts) {
          ns.killall(server.hostname);
        }
        ns.scp(filesToCopy, server.hostname);

        if (targetSelf) {
          if ((server.moneyMax ?? 0) > 0 && server.backdoorInstalled) {
            execScript(ns, server.hostname, script, server.hostname);
          }
        } else {
          execScript(ns, server.hostname, script, targetServer);
        }
      });

    // Manage scripts on `home`
    if (resetScripts) {
      ns.scriptKill('/scripts/zac_hack.js', 'home');
      ns.scriptKill('/scripts/share.js', 'home');
    }
    if (targetSelf) {
      execScript(ns, 'home', '/scripts/share.js')
    } else {
      execScript(ns, 'home', script, targetServer);
    }

    // Manage purchased servers
    ns.getPurchasedServers()
      .forEach(s => {
        if (resetScripts) {
          ns.killall(s);
        }
        ns.scp(filesToCopy, s);

        if (targetSelf) {
          // TODO Modify this to function as a 'prepper'
          //  Iterating servers and min-maxing grow-weaken
          // Will want to use a proper port-based manager technique so
          //  target can change w/o having to reset the scripts
          execScript(ns, s, '/scripts/share.js');
        } else {
          switch (s.split('-')[0]) { // Check the hostname's prefix
            case 'weaken':
              execScript(ns, s, '/scripts/weaken.js', targetServer);
              break;
            case 'grow':
              execScript(ns, s, '/scripts/grow.js', targetServer);
              break;
            case 'share':
              execScript(ns, s, '/scripts/share.js');
              break;
            case 'cluster':
              execScript(ns, s, script, targetServer);
              break;
            default:
            // Leave it be, special use systems
          }
        }
      })

    // We only need to kill scripts when restarting/changing target
    // Otherwise, we will interrupt HGW calls
    resetScripts = false;

    const logs = ns.getScriptLogs();

    if (logs.length > MAX_LOG_LINES) {
      while (logs.length > MAX_LOG_LINES) {
        logs.shift();
      }

      ns.clearLog();
      let nextLine = logs.shift();
      while (nextLine) {
        ns.print(nextLine);
        nextLine = logs.shift();
      }
    }

    await ns.sleep(config.loopDelay);
  }
}