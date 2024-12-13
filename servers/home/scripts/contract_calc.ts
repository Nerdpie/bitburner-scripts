import {ContractCalc} from "@/servers/home/scripts/settings"
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits";

import {ContractWrapper} from "@/servers/home/scripts/codingcontracts/contract_util";

/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  ns.tail();
  ns.clearLog();

  const config = ContractCalc;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  if (!globalThis.Player) {
    exposeGameInternalObjects()
  }

  // REFINE Swap to Singularity when available...
  const currentServer = globalThis.Player.getCurrentServer().hostname;
  const availableContracts = ns.ls(currentServer, '.cct');

  let chosenContract: string;
  if (!availableContracts || availableContracts.length === 0) {
    ns.print('No contracts found on server: ' + currentServer);
  } else if (availableContracts.length === 1) {
    chosenContract = availableContracts[0];
  } else {
    chosenContract = <string>await ns.prompt("Which contract?", {type: "select", choices: availableContracts});
  }

  if (chosenContract) {
    const contractData = new ContractWrapper(ns, currentServer, chosenContract);

    if (contractData.solver.finished) {
      const autoSolve = <boolean>await ns.prompt("Solver finished; complete automatically?", {type: "boolean"})
      if (autoSolve) {
        await contractData.attemptToSolve(ns);
      }
    } else {
      ns.print('Contract type: ' + contractData.type);
      ns.print('Contract description:\n' + contractData.description);
      ns.print('Contract data:\n' + contractData.data);
    }
    ns.print('Calculated solution is:\n' + await contractData.getSolution(ns));
  }
}