// Based originally on the guide at https://steamcommunity.com/sharedfiles/filedetails/?id=3241603650

import {BackdoorConcat, ScriptSettings} from "@/servers/home/scripts/settings"
import {getAllServers} from "@/servers/home/scripts/lib/scan_servers"
import {Server} from "NetscriptDefinitions";

function getAvailableTools(ns: NS): ((host: string) => void)[] {
  const PROGRAMS: ({ file: string; action: (host: string) => void })[] = [
    {file: "BruteSSH.exe", action: ns.brutessh},
    {file: "FTPCrack.exe", action: ns.ftpcrack},
    {file: "RelaySMTP.exe", action: ns.relaysmtp},
    {file: "HTTPWorm.exe", action: ns.httpworm},
    {file: "SQLInject.exe", action: ns.sqlinject}
  ];

  let availableTools: ((host: string) => void)[] = [];

  PROGRAMS.forEach(program => {
    if (ns.fileExists(program.file)) {
      availableTools.push(program.action);
    }
  })

  return availableTools;
}

function pwnServer(ns: NS, target: string, tools) {
  let server: Server = ns.getServer(target);

  // Don't waste cycles if we already own the box
  if (server.hasAdminRights) {
    tryBackdoor(ns, server)
    return true;
  }

  let openPorts = 0;
  tools.forEach(tool => {
    tool(target);
    openPorts++;
  })

  if (server.numOpenPortsRequired <= openPorts) {
    ns.nuke(target);
    ns.printf('Target pwned: %s', target);

    tryBackdoor(ns, server)
    return true;
  }

  return false;
}

/**
 * @param {NS} ns
 * @param {Server} server
 */
function tryBackdoor(ns: NS, server: Server) {
  if (!server.backdoorInstalled
    && !server.purchasedByPlayer
    && server.requiredHackingSkill <= ns.getHackingLevel()) {
    // Don't have Singularity access yet
    if (BackdoorConcat.includes(server.hostname)
      || ScriptSettings.deploy.targetServer === server.hostname) {
      // In our 'make sure we bd' list
      ns.printf('Need to backdoor: %s', server.hostname);
    }
  }
}

function execScript(ns: NS, server: string, script: string, targetServer?: string): void {
  let ramCost = ns.getScriptRam(script, server);

  let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  if ('home' === server) {
    ramAvailable -= 128; // Leave some RAM free on `home`
  }

  let numThreads = Math.floor(ramAvailable / ramCost);
  if (numThreads > 0) {
    if (targetServer) {
      ns.exec(script, server, numThreads, targetServer);
    } else {
      ns.exec(script, server, numThreads)
    }
  }
}

function buildCluster(ns: NS, config) {
  const RAM_CAPACITY = config.ramCapacity
  buyServers(ns, 'cluster-', config.clusterCount, RAM_CAPACITY)
  buyServers(ns, 'weaken-', config.weakenCount, RAM_CAPACITY)
  buyServers(ns, 'grow-', config.growCount, RAM_CAPACITY)
  buyServers(ns, 'share-', config.shareCount, RAM_CAPACITY)
}

function buyServers(ns: NS, prefix: string, count: number, ramCapacity: number): void {
  const PRICE = ns.getPurchasedServerCost(ramCapacity);
  for (let i = 0; i < count; i++) {
    let serverName = prefix + i;
    let isOwned = false;
    try {
      const srv = ns.getServer(serverName)

      // Check if the server's RAM is at the current target
      if (srv.maxRam < ramCapacity) {
        if (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerUpgradeCost(srv.hostname, ramCapacity)) {
          ns.printf("Insufficient funds to upgrade %s", srv.hostname);
        } else {
          ns.upgradePurchasedServer(srv.hostname, ramCapacity);
        }
      }
      isOwned = true;
    } catch {
      // We only care if it can be found, and getServer throws an error rather than returning `undefined`...
    }

    if (!isOwned) {
      if (ns.getServerMoneyAvailable('home') < PRICE) {
        ns.printf("Insufficient funds to buy %s", serverName)
        break;
      }
      ns.purchaseServer(serverName, ramCapacity);
    }
  }
}

/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  // TODO Add single-instance checks

  ns.clearLog();
  ns.tail();

  let config = ScriptSettings.deploy;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  ns.disableLog('disableLog'); // Ironic, no?
  ns.disableLog('ALL');

  const MAX_LOG_LINES = 25;

  let servers: string[];
  let tools: ((host: string) => void)[];
  let script: string;

  let targetSelf = config.targetSelf; // Targeting self, or a specific server
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

  let filesToCopy = [
    script,
    '/scripts/weaken.js',
    '/scripts/grow.js',
    '/scripts/share.js'
  ]

  if (!targetSelf && !ns.getServer(targetServer).backdoorInstalled) {
    ns.printf('Target server not yet pwned - %s', targetServer);
    targetSelf = true;
  }

  // noinspection InfiniteLoopJS - Intended design
  while (true) {
    ns.printf('Looping at %s', new Date(Date.now()).toLocaleString());

    buildCluster(ns, config)

    // Mainly for [spoilers] becoming available
    servers = getAllServers(ns);

    // Check inside the loop in case we unlock more tools
    tools = getAvailableTools(ns);

    if (resetScripts) {
      ns.print("Killing running scripts")
    }

    servers.filter(s => (s !== 'home'))
      .filter(s => !s.startsWith('weaken-'))
      .filter(s => !s.startsWith('cluster-'))
      .filter(s => !s.startsWith('grow-'))
      .filter(s => !s.startsWith('share-'))
      .filter(s => pwnServer(ns, s, tools))
      .forEach(server => {
        if (resetScripts) {
          ns.killall(server);
        }
        ns.scp(filesToCopy, server);

        if (targetSelf) {
          if (ns.getServerMaxMoney(server) > 0 && ns.getServer(server).backdoorInstalled) {
            execScript(ns, server, script, server);
          }
        } else {
          execScript(ns, server, script, targetServer);
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
          execScript(ns, s, '/scripts/share.js', targetServer);
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

    let logs = ns.getScriptLogs();

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