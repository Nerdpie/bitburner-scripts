import {jsonReplacer, jsonReviver}         from '@lib/insight_json';
import {getAllServers}                     from '@lib/scan_servers';
import {ContractDispatcher, setTailWindow} from '@settings';
import {ContractWrapper}                   from './contract_util';

const LOG_FILE = '/logs/contracts.json';
let failedEntries: ContractLogEntry[] = [];

function getAllContracts(ns: NS): ContractWrapper[] {
  const servers = getAllServers(ns);
  const contracts: ContractWrapper[] = [];

  servers.forEach(server => {
    ns.ls(server, '.cct').forEach((c) => {
      contracts.push(new ContractWrapper(ns, server, c));
    });
  });

  return contracts;
}

async function attemptAndLog(ns: NS, contract: ContractWrapper) {
  // Log the time
  ns.print(new Date().toLocaleTimeString([], {hourCycle: 'h23'}));
  ns.print(`Type: ${contract.type}`);
  const reward = await contract.attemptToSolve(ns);
  if (reward && reward.length > 0) {
    ns.print(`Success - Reward: ${reward}`);
  } else {
    ns.print(`Failure - Incorrect solution`);
    ns.alert(`Failed to solve: ${contract.type}`);
    failedEntries.push({
      Hostname: contract.host,
      ContractName: contract.filename,
      ContractType: contract.type,
      FailedTime: new Date(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Data: contract.data
    });
  }
}

export async function main(ns: NS): Promise<void> {
  const DISABLED_LOGS = [
    'scan',
    'sleep',
    'codingcontract.attempt'
  ];
  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const logContents = ns.read(LOG_FILE);
  if (logContents && logContents.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    failedEntries = JSON.parse(logContents, jsonReviver);
  }

  setTailWindow(ns, ContractDispatcher, false);
  ns.print(`Dispatcher started at ${new Date().toLocaleTimeString([], {hourCycle: 'h23'})}`);

  // noinspection InfiniteLoopJS - Intended design
  while (true) {
    const contractsToAttempt = getAllContracts(ns)
      .filter(c => c.solver.finished)
      .filter(c => !failedEntries.some(f => f.Hostname === c.host && f.ContractName === c.filename));

    for (const c1 of contractsToAttempt) {
      await attemptAndLog(ns, c1);
    }

    // Store the failed attempts
    if (failedEntries.length > 0) {
      ns.write(LOG_FILE, JSON.stringify(failedEntries, jsonReplacer), 'w');
    }

    // TODO Check the assumptions and bounds for all contracts
    //    For instance, can the max sum of a subarray be negative?

    // noinspection MagicNumberJS - Waiting 15 minutes before checking again
    await ns.sleep(15 * 60 * 1000);
  }
  /*
  This script will replace parts of `scan_contracts.ts` and `contract_calc.ts`
  It will iterate over the set of servers, checking for contracts
  It will then see if we have a finished solver written for each
  If yes, it will automatically solve them
  If it fails, it will stop after the first attempt and log such
  If we do not have a solver finished, it will record the contract name and server in a file

  The replacement for `contract_calc.ts` will check what server the player is on.
  If there are contracts found on that server, it will then prompt which one, if multiple are present.
  It will then execute the WiP solver, if present, displaying the data
   */
}

/*
Scratchpad for the data tracking structure
- Need to keep logging of any failed attempts; need timestamp, type, and data
 */

interface ContractLogEntry {
  Hostname: string;
  ContractName: string;
  ContractType: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data: any,
  FailedTime: Date,
}
