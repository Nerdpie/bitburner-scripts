import {getAllServers} from "@/servers/home/scripts/lib/scan_servers";
import {ContractWrapper} from "@/servers/home/scripts/codingcontracts/contract_util";

function getAllContracts(ns: NS): ContractWrapper[] {
  const servers = getAllServers(ns);
  const contracts: ContractWrapper[] = [];

  servers.forEach(server => {
    ns.ls(server, '.cct').forEach((c) => {
      contracts.push(new ContractWrapper(ns, server, c));
    })
  });

  return contracts;
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog('disableLog')
  ns.disableLog('scan')

  ns.setTitle("Contract Dispatcher");

  // noinspection InfiniteLoopJS - Intended design
  while (true) {
    // TODO Add logic to track what contracts have been attempted and failed
    for (const c1 of getAllContracts(ns).filter(c => c.solver.finished)) {
      await c1.attemptToSolve(ns)
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