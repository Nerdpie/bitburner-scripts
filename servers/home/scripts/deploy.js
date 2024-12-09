// Based heavily on the guide at https://steamcommunity.com/sharedfiles/filedetails/?id=3241603650

import { ScriptSettings, BackdoorConcat } from "@/servers/home/scripts/settings"
import { getAllServers } from "@/servers/home/scripts/lib/scan_servers"

/** @param {NS} ns */
function getAvailableTools(ns) {
  const PROGRAMS = [
    { file: "BruteSSH.exe", action: ns.brutessh },
    { file: "FTPCrack.exe", action: ns.ftpcrack },
    { file: "RelaySMTP.exe", action: ns.relaysmtp },
    { file: "HTTPWorm.exe", action: ns.httpworm },
    { file: "SQLInject.exe", action: ns.sqlinject }
  ];

  let availableTools = [];

  PROGRAMS.forEach(program => {
    if (ns.fileExists(program.file)) {
      availableTools.push(program.action);
    }
  })

  return availableTools;
}

/** @param {NS} ns */
function pwnServer(ns, target, tools) {
  let server = ns.getServer(target);

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

  //ns.printf('Open ports on %s : %s', target, openPorts);
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
function tryBackdoor(ns, server) {
  // FIXME This will likely error when we unlock the Singularity API...
  const con = eval("ns.singularity.connect")
  const bd = eval("ns.singularity.installBackdoor")

  if (!server.backdoorInstalled
    && !server.purchasedByPlayer
    && server.requiredHackingSkill <= ns.getHackingLevel()) {
    try {
      con(target);
      bd();
    } catch {
      // Don't have Singularity access yet
      if (BackdoorConcat.includes(server.hostname)
        || ScriptSettings.deploy.targetServer == server.hostname) {
        // In our 'make sure we bd' list
        ns.printf('Need to backdoor: %s', server.hostname);
      }
    }
  }
}

/** @param {NS} ns */
function execScript(ns, server, script, targetServer) {
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

/** 
 * @param {NS} ns
 * @param config
 */
function buildCluster(ns, config) {
  const RAM_CAPACITY = config.ramCapacity
  buyServers(ns, 'cluster-', config.clusterCount, RAM_CAPACITY)
  buyServers(ns, 'weaken-', config.weakenCount, RAM_CAPACITY)
  buyServers(ns, 'grow-', config.growCount, RAM_CAPACITY)
  buyServers(ns, 'share-', config.shareCount, RAM_CAPACITY)
}

/** 
 * @param {NS} ns
 * @param {string} prefix
 * @param {number} count
 */
function buyServers(ns, prefix, count, ramCapacity) {
  const PRICE = ns.getPurchasedServerCost(ramCapacity);
  for (let i = 0; i < count; i++) {
    let serverName = prefix + i;
    let isOwned = false;
    try {
      ns.getServer(serverName)
      isOwned = true;
    } catch {
      // We only care if it can be found, and getServer throws an error rather than returning `undefined`...
    }
    if (isOwned) { continue; } // Already owned
    if (ns.getServerMoneyAvailable('home') < PRICE) {
      ns.printf("Insufficient funds to buy %s", serverName)
      break;
    }
    ns.purchaseServer(serverName, ramCapacity);
  }
}

/** @param {NS} ns */
export async function main(ns) {
  // TODO Add single-instance checks

  ns.clearLog();
  ns.tail();

  let config = ScriptSettings.deploy;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  ns.disableLog('disableLog'); // Ironic, no?
  ns.disableLog('ALL');

  const MAX_LOG_LINES = 25;

  let servers;
  let tools;
  let script;

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

  // Include additional files so we don't have to jump to `home` for some commands
  // TODO Revisit this, since 1) we leave tail windows up, and 2) we use all the RAM on the remotes...
  let filesToCopy = [
    script,
    '/scripts/scan_files.js',
    '/scripts/find_server.js',
    '/scripts/lib/scan_servers.js',
    '/scripts/weaken.js',
    '/scripts/grow.js',
    '/scripts/share.js'
  ]

  if (!targetSelf && !ns.getServer(targetServer).backdoorInstalled) {
    ns.printf('Target server not yet pwned - %s', targetServer);
    targetSelf = true;
  }

  while (true) {
    ns.printf('Looping at %s', new Date(Date.now()).toLocaleString());

    buildCluster(ns, config)

    // Mainly for [spoilers] becoming available
    servers = getAllServers(ns);

    // Check inside the loop in case we unlock more tools
    tools = getAvailableTools(ns);

    if (resetScripts) { ns.print("Killing running scripts") }

    servers.filter(s => (s !== 'home'))
      .filter(s => !s.startsWith('weaken-'))
      .filter(s => !s.startsWith('cluster-'))
      .filter(s => !s.startsWith('grow-'))
      .filter(s => !s.startsWith('share-'))
      .filter(s => pwnServer(ns, s, tools))
      .forEach(server => {
        if (resetScripts) { ns.killall(server); }
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
    let cluster = ns.getPurchasedServers();
    cluster.forEach(s => {
      if (resetScripts) { ns.killall(s); }
      ns.scp(filesToCopy, s);

      if (targetSelf) {
        execScript(ns, s, '/scripts/share.js', targetServer);
      } else {
        if (s.startsWith('weaken-')) {
          execScript(ns, s, '/scripts/weaken.js', targetServer);
        } else if (s.startsWith('grow-')) {
          execScript(ns, s, '/scripts/grow.js', targetServer);
        } else if (s.startsWith('share-')) {
          execScript(ns, s, '/scripts/share.js');
        } else if (s.startsWith('cluster-')) {
          execScript(ns, s, script, targetServer);
        } else {
          // Leave it be, special use systems
          // TODO Write a routine that goes through all eligible servers, and pushes them to 100% money, min sec
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

    await ns.sleep(60 * 1000);
  }
}

