// Based originally on the guide at https://steamcommunity.com/sharedfiles/filedetails/?id=3241603650

import {BuiltinServer, ValidRamCapacity}                 from "@lib/enum_and_limiter_definitions";
import {exposeGameInternalObjects}                       from "@lib/exploits";
import {getAllServers}                                   from "@lib/scan_servers";
import {assertBackdoorInstalled, assertServerProperties} from "@lib/server_util";
import {getTimeStamp}                                    from "@lib/time_util";
import {Deploy, ServerSelections, setTailWindow}         from "@settings";
import type {Server}                                     from "NetscriptDefinitions";

const config = Deploy;
let prevHackingLevel = 0;
let prevTarget: BuiltinServer | undefined = undefined;

function getAvailableTools(ns: NS): ((host: string) => void)[] {
  const PROGRAMS: ({ file: string; action: (host: string) => void })[] = [
    // eslint-disable-next-line @typescript-eslint/unbound-method
    {file: "BruteSSH.exe", action: ns.brutessh},
    // eslint-disable-next-line @typescript-eslint/unbound-method
    {file: "FTPCrack.exe", action: ns.ftpcrack},
    // eslint-disable-next-line @typescript-eslint/unbound-method
    {file: "RelaySMTP.exe", action: ns.relaysmtp},
    // eslint-disable-next-line @typescript-eslint/unbound-method
    {file: "HTTPWorm.exe", action: ns.httpworm},
    // eslint-disable-next-line @typescript-eslint/unbound-method
    {file: "SQLInject.exe", action: ns.sqlinject},
  ];

  const availableTools: ((host: string) => void)[] = [];

  PROGRAMS.forEach(program => {
    if (ns.fileExists(program.file)) {
      availableTools.push(program.action);
    }
  });

  return availableTools;
}

function pwnServer(ns: NS, target: Required<Server>, tools: ((host: string) => void)[]) {
  // Don't waste cycles if we already own the box
  if (target.hasAdminRights) {
    tryBackdoor(ns, target);
    return true;
  }

  let openPorts = 0;
  tools.forEach(tool => {
    tool(target.hostname);
    openPorts++;
  });

  if (target.numOpenPortsRequired <= openPorts) {
    ns.nuke(target.hostname);
    //ns.printf('Target pwned: %s', target.hostname);

    tryBackdoor(ns, target);
    return true;
  }

  return false;
}

/**
 * @param {NS} ns
 * @param {Server} server
 */
function tryBackdoor(ns: NS, server: Required<Server>) {
  // FIXME Ensure that this actually keeps it from auto-backdooring...
  if (!config.hackTheWorld && server.hostname as BuiltinServer === BuiltinServer["w0r1d_d43m0n"]) {
    if (server.requiredHackingSkill <= ns.getHackingLevel()) {
      ns.printf("Can backdoor: %s", BuiltinServer["w0r1d_d43m0n"]);
    }
    return;
  }

  if (!globalThis.Terminal) {
    throw new Error("Failed to expose Terminal");
  }

  const terminal = globalThis.Terminal;

  // Revisit when we have Singularity access ... or not
  if (!server.backdoorInstalled
    && !server.purchasedByPlayer
    && server.requiredHackingSkill <= ns.getHackingLevel()) {
    try {
      // Make sure the Terminal isn't busy with another action
      if (terminal.action === null) {
        terminal.connectToServer(server.hostname);
        terminal.executeCommands("backdoor");
      }
    } catch {
      // We'll backdoor it eventually
    }
  }
}

function execScript(ns: NS, server: Server, script: string, targetServer?: string): void {
  const ramCost = ns.getScriptRam(script, server.hostname);

  const freshServer = ns.getServer(server.hostname);
  let ramAvailable = freshServer.maxRam - freshServer.ramUsed;
  if ("home" === server.hostname) {
    ramAvailable -= config.homeReservedRam;
  }

  const numThreads = Math.floor(ramAvailable / ramCost);
  if (numThreads > 0) {
    if (targetServer === undefined) {
      ns.exec(script, server.hostname, numThreads);
    } else {
      ns.exec(script, server.hostname, numThreads, targetServer);
    }
  }
}

function buildCluster(ns: NS) {
  let targetCapacityExponent = 0;
  let ramCapacity: ValidRamCapacity;
  // Start with the lowest capacity, and step towards our target
  // Allows building up sooner
  // noinspection OverlyComplexBooleanExpressionJS - Abusing boolean expression to short-circuit if low on funds
  do {
    targetCapacityExponent++;
    // noinspection MagicNumberJS - Ensure we don't exceed the max valid RAM capacity
    if (targetCapacityExponent > 20) {
      break;
    }
    ramCapacity = 2 ** targetCapacityExponent;
  } while (ramCapacity <= config.ramCapacity &&
  buyServers(ns, "cluster-", config.clusterCount, ramCapacity) &&
  buyServers(ns, "prep-", config.prepCount, ramCapacity) &&
  buyServers(ns, "weaken-", config.weakenCount, ramCapacity) &&
  buyServers(ns, "grow-", config.growCount, ramCapacity) &&
  buyServers(ns, "share-", config.shareCount, ramCapacity));
}

/**
 * Attempts to buy/upgrades servers
 * @param ns
 * @param prefix
 * @param count
 * @param ramCapacity
 * @returns Whether all requested servers were bought/upgraded
 */
function buyServers(ns: NS, prefix: string, count: number, ramCapacity: number): boolean {
  const PRICE = ns.getPurchasedServerCost(ramCapacity) * config.purchaseThreshold;
  for (let i = 0; i < count; i++) {
    const serverName = prefix + i.toString();
    if (ns.serverExists(serverName)) {
      // Check if the server's RAM is at the current target
      if (ns.getServerMaxRam(serverName) < ramCapacity) {
        const upgradePrice = ns.getPurchasedServerUpgradeCost(serverName, ramCapacity) * config.purchaseThreshold;
        if (ns.getServerMoneyAvailable("home") < upgradePrice) {
          return false;
        }
        ns.upgradePurchasedServer(serverName, ramCapacity);
      }
    } else {
      if (ns.getServerMoneyAvailable("home") < PRICE) {
        return false;
      }
      ns.purchaseServer(serverName, ramCapacity);
    }
  }
  return true;
}

function computeBackdoorScore(s: Server): number {
  // Smaller return value means more desirable
  // Internally, bigger is more desirable
  const name = s.hostname;
  const typedName = s.hostname as keyof typeof BuiltinServer;
  const level = s.requiredHackingSkill ?? 0;

  // Using bit flags for easy comparison
  // Represent that the server is the configured target,
  // or in a specific `ServerSelections` list
  const HGW_TARGET_FACTOR = 1 << 6;
  const ALWAYS_TARGET_FACTOR = 1 << 5;
  const GOOD_TARGET_FACTOR = 1 << 4;
  const FACTION_TARGET_FACTOR = 1 << 3;
  const CLASSES_TARGET_FACTOR = 1 << 2;
  const COMPANY_TARGET_FACTOR = 1 << 1;

  let score = 0;

  // We only actually care about the first one to set the magnitude
  // While it doesn't HAVE to be an else-if tree, no need for the other comparison to run every loop...
  // noinspection IfStatementWithTooManyBranchesJS
  if (config.targetServer === name as BuiltinServer) {
    // MEMO Leaving the `targetServer` check for completeness, even though it isn't strictly needed
    //  Still going to check in the outer function to reduce overhead where practical.
    //  Yay, premature micro-optimizations!
    score += HGW_TARGET_FACTOR;
  } else if (ServerSelections.alwaysBackdoor.includes(typedName)) {
    score += ALWAYS_TARGET_FACTOR;
  } else if (ServerSelections.goodTargets.includes(typedName)) {
    score += GOOD_TARGET_FACTOR;
  } else if (ServerSelections.factionsBackdoor.includes(typedName)) {
    score += FACTION_TARGET_FACTOR;
  } else if (ServerSelections.classesBackdoor.includes(typedName)) {
    score += CLASSES_TARGET_FACTOR;
  } else if (ServerSelections.companyBackdoor.includes(typedName)) {
    score += COMPANY_TARGET_FACTOR;
  }

  // Add the required hacking level as a component;
  // lowest significance, so we add the inverse
  // E.g. a level of 1 results in 1/1 => 1,
  // while a level of 255 results in 1/255 => ~0.004
  if (level > 0) {
    score += (1 / level);
  }

  // Flip the score so that we match the sort order convention
  return (HGW_TARGET_FACTOR << 1) - score;
}

function sortBackdoorPriority(a: Server, b: Server): number {
  // Make sure we hit our target server FIRST
  if (Deploy.targetServer === a.hostname as BuiltinServer) {
    return -1;
  }
  if (Deploy.targetServer === b.hostname as BuiltinServer) {
    return 1;
  }

  return computeBackdoorScore(a) - computeBackdoorScore(b);
}

/**
 * Dynamically determine the best target
 * @param ns
 * @return Tuple containing whether to reset scripts, whether to target self, and the target server
 */
function getDynamicTarget(ns: NS): [boolean, boolean, BuiltinServer | undefined] {
  const curHackingLevel = ns.getHackingLevel();
  // REFINE This can cause issues if we WOULD change targets, but they haven't been backdoored yet
  // Short-circuit if our hacking level hasn't changed, and we have a target selected
  if (prevHackingLevel === curHackingLevel && prevTarget !== undefined) {
    return [false, false, prevTarget];
  }

  const TARGET_OPTIONS = ServerSelections.goodTargets;

  // This worked inline before, but apparently it confuses the snot out of the TS compiler's `strict` mode?
  function reduceTargetServer(acc: [number, BuiltinServer | undefined], current: Required<Server>): [number, BuiltinServer | undefined] {
    if (acc[0] < current.requiredHackingSkill) {
      return [current.requiredHackingSkill, (current.hostname as BuiltinServer)];
    }
    return acc;
  }

  // At low levels, we want to hit Joe's Guns ASAP; usually level 11
  // Yes, if you try to evaluate EACH server, this may jump back down, but not with a proper list of good targets
  const targetLevel = curHackingLevel <= 30 ? curHackingLevel : Math.ceil(curHackingLevel / 2);
  const targetServer = TARGET_OPTIONS.map(n => assertServerProperties(ns.getServer(n)))
    .filter(s => s.requiredHackingSkill <= targetLevel && s.backdoorInstalled)
    .reduce(reduceTargetServer, [0, (undefined as BuiltinServer | undefined)])[1];

  const changedTarget = targetServer !== prevTarget;
  prevTarget = targetServer;
  prevHackingLevel = curHackingLevel;

  if (changedTarget) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    ns.printf(`[${getTimeStamp()}] Now targeting: ${targetServer}`);
  }

  return [changedTarget, targetServer === undefined, targetServer];
}

function isAnotherInstanceRunning(ns: NS): boolean {
  const self = ns.self();
  return ns.ps().some(v => v.pid !== self.pid && v.filename === self.filename);
}

/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  if (isAnotherInstanceRunning(ns)) {
    return;
  }

  setTailWindow(ns, config);

  ns.disableLog("disableLog"); // Ironic, no?
  const DEBUGGING = false;
  // Keeping for easy use in case of future headaches
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (DEBUGGING) {
    const DISABLED_LOGS = [
      "scan",
      "brutessh",
      "ftpcrack",
      "relaysmtp",
      "httpworm",
      "sqlinject",
      "nuke",
      "getHackingLevel",
      "getScriptRam",
      "getPurchasedServerCost",
      "getServerMaxRam",
      "getPurchasedServerUpgradeCost",
      "getServerMoneyAvailable",
      "upgradePurchasedServer",
      "getServer",
      "killall",
      "sleep",
      "scp",
      "exec",
    ];
    DISABLED_LOGS.forEach(log => ns.disableLog(log));
  } else {
    ns.disableLog("ALL");
  }

  let tools: ((host: string) => void)[];
  let script: string;
  let prepTarget: string | null = null;

  // FIXME A number of the settings are mutually exclusive, such as `dynamicTarget` and `grow-farm`...
  // REFINE Is this setting needed going forward?
  //  Do most of the others need to be pulled from the config, or just computed?
  let targetSelf = config.targetSelf;
  // noinspection ES6ConvertLetToConst - Need to rework this to be dynamic ANYWAY...
  let targetServer: BuiltinServer | undefined = config.targetServer;
  let resetScripts = config.resetScripts;
  let loopDelay = config.loopDelay;
  const killDelay = 0;

  switch (config.mode) {
    case "share":
      script = "/scripts/share.js";
      break;
    case "hgw":
      script = "/scripts/zac_hack.js";
      break;
    case "grow-farm":
      script = "/scripts/prep.js";
      break;
    default:
      // `config.mode` is highlighted due to value narrowing
      // Leave it here in case we add a new option and don't fully implement it
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      ns.print(`WARNING: Invalid mode '${config.mode}' - defaulting to 'hgw'`);
      script = "/scripts/zac_hack.js";
  }

  const filesToCopy = [
    "/scripts/zac_hack.js",
    "/scripts/weaken.js",
    "/scripts/grow.js",
    "/scripts/share.js",
    "/scripts/prep.js",
  ];

  if (!config.dynamicTarget && !targetSelf && !assertBackdoorInstalled(ns.getServer(targetServer))) {
    ns.printf("Target server not yet pwned - %s", targetServer);
    targetSelf = true;
  }

  if (!globalThis.Terminal) {
    exposeGameInternalObjects();
  }

  ns.printf("[%s] Starting", getTimeStamp());

  // noinspection InfiniteLoopJS - Intended design
  while (true) {
    buildCluster(ns);

    // Check inside the loop in case we unlock more tools
    tools = getAvailableTools(ns);

    if (config.dynamicTarget) {
      [resetScripts, targetSelf, targetServer] = getDynamicTarget(ns);
    }

    if (!targetSelf && targetServer === undefined) {
      throw new Error("Trying to target an undefined server!");
    }

    if (config.mode === "grow-farm" && script === "/scripts/prep.js") {
      const growTarget = ns.getServer(targetServer);
      if (growTarget.moneyAvailable === growTarget.moneyMax && growTarget.hackDifficulty === growTarget.minDifficulty) {
        // We have fully prepped the target; switch to JUST grow
        resetScripts = true;
        script = "/scripts/grow.js";
      }
    }

    const serverList = getAllServers(ns)
      .map(s => ns.getServer(s));

    const nonPurchasedServers = serverList
      .filter(s => !s.purchasedByPlayer)
      .map(assertServerProperties)
      .sort(sortBackdoorPriority);

    const backdooredServers = nonPurchasedServers.filter(s => s.backdoorInstalled);

    // REFINE Ideally, this would increase the delay sooner, and more gradually, but late into a run,
    //  high hacking stats can make backdoor installs FAST... and a proper batcher removes half of the need
    // If we've backdoored all servers (ignoring w0r1d_d43m0n), increase the loop delay
    if (nonPurchasedServers.filter(s => s.hostname as BuiltinServer !== BuiltinServer["w0r1d_d43m0n"]).length === backdooredServers.length) {
      // noinspection MagicNumberJS - Five minutes
      loopDelay = 5 * 60 * 1000;
    }

    const pwnedServers = nonPurchasedServers.filter(s => pwnServer(ns, s, tools));

    if (resetScripts) {
      pwnedServers.forEach(server => ns.killall(server.hostname));
      await ns.sleep(killDelay);
    }

    pwnedServers.forEach(server => {
      ns.scp(filesToCopy, server.hostname);

      if (targetSelf) {
        if (server.moneyMax > 0 && server.backdoorInstalled) {
          execScript(ns, server, script, server.hostname);
        } else if (server.hasAdminRights) {
          // REFINE Won't change properly unless `resetScripts` is set for another reason...
          if (server.minDifficulty < server.hackDifficulty || server.moneyAvailable < server.moneyMax) {
            execScript(ns, server, "/scripts/prep.js", server.hostname);
          } else {
            execScript(ns, server, "/scripts/grow.js", server.hostname);
          }
        }
      } else {
        execScript(ns, server, script, targetServer);
      }
    });

    // FIXME Since we do not reset different types of scripts separately,
    //  handling this outside of `grow-farm` mode ruins the usability of purchased servers.
    if (config.mode === "grow-farm") {
      // Determine any servers that need to be prepped
      // While this runs even if it isn't used, that is somewhat preferable to being re-run for each purchased server
      const toBePrepped = nonPurchasedServers.filter(s => s.hasAdminRights
          && (s.moneyAvailable < s.moneyMax || s.minDifficulty < s.hackDifficulty))
        .sort(sortBackdoorPriority);
      if (toBePrepped.length > 0 && toBePrepped[0].hostname as BuiltinServer === targetServer) {
        // FIXME Determine how to ignore `targetServer` once it has been prepped
      }
      if (toBePrepped.length > 0) {
        if (toBePrepped[0].hostname !== prepTarget) {
          resetScripts = true;
          prepTarget = toBePrepped[0].hostname;
          ns.printf(`[${getTimeStamp()}] Now prepping: ${prepTarget}`);
        }
      } else if (prepTarget !== null) {
        prepTarget = null;
        resetScripts = true;
        ns.printf(`[${getTimeStamp()}] No target to prep`);
      }
    }

    // Manage scripts on `home`
    const home = ns.getServer("home");
    if (resetScripts) {
      filesToCopy.forEach(f => {
        ns.scriptKill(f, "home");
      });
      await ns.sleep(killDelay);
    }
    if (targetSelf) {
      if (prepTarget === null) {
        execScript(ns, home, "/scripts/share.js");
      } else {
        execScript(ns, home, "/scripts/prep.js", prepTarget);
      }
    } else {
      execScript(ns, home, script, targetServer);
    }

    // Manage purchased servers
    const purchasedServers = serverList.filter(s => s.purchasedByPlayer && s.hostname !== "home");

    // FIXME Scripts do not seem to start until the next pass after `resetScripts` is run?
    // Or is it extreme UI lag?
    if (resetScripts) {
      purchasedServers.forEach(s => ns.killall(s.hostname));
      await ns.sleep(killDelay);
    }

    purchasedServers.forEach(s => {
      ns.scp(filesToCopy, s.hostname);

      if (targetSelf) {
        // TODO Optimize this prepper functionality
        // Will want to use a proper port-based manager technique so
        //  target can change w/o having to reset the scripts
        if (prepTarget === null) {
          execScript(ns, s, "/scripts/share.js");
        } else {
          execScript(ns, s, "/scripts/prep.js", prepTarget);
        }
      } else {
        switch (s.hostname.split("-")[0]) { // Check the hostname's prefix
          case "weaken":
            execScript(ns, s, "/scripts/weaken.js", targetServer);
            break;
          case "grow":
            execScript(ns, s, "/scripts/grow.js", targetServer);
            break;
          case "share":
            execScript(ns, s, "/scripts/share.js");
            break;
          case "prep":
            // If we don't have a prep target, do SOMETHING
            if (prepTarget === null) {
              execScript(ns, s, "/scripts/share.js");
            } else {
              execScript(ns, s, "/scripts/prep.js", prepTarget);
            }
            break;
          case "cluster":
            execScript(ns, s, script, targetServer);
            break;
          default:
          // Leave it be, special use systems
        }
      }
    });

    // We only need to kill scripts when restarting/changing target
    // Otherwise, we will interrupt HGW calls
    // Irrelevant when dynamic targeting is enabled
    resetScripts = false;

    await ns.sleep(loopDelay);
  }
}
