import {ContractCalc, setTailWindow} from "@/servers/home/scripts/settings"
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits";

import {ContractWrapper} from "@/servers/home/scripts/coding_contracts/contract_util";

/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  setTailWindow(ns, ContractCalc);

  if (!globalThis.Player) {
    exposeGameInternalObjects()
  }

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
      ns.print('Contract data:\n' + typeof contractData.data + ': ' + contractData.data);
    }
    ns.print('Calculated solution is:\n' +  await contractData.getSolution(ns));
  }
}