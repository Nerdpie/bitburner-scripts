import {exposeGameInternalObjects}   from "@lib/exploits";
import {jsonReplacer}                from "@lib/insight_json";
import {ContractCalc, setTailWindow} from "@settings";
import {ContractWrapper}             from "./coding_contracts/contract_util";

/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  setTailWindow(ns, ContractCalc);

  ns.disableLog("disableLog");
  const DISABLED_LOGS = [
    "sleep",
  ];
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  if (!globalThis.Player) {
    exposeGameInternalObjects();
  }

  if (!globalThis.Player) {
    throw new Error("Failed to expose Player");
  }

  const player = globalThis.Player;
  const currentServer = player.getCurrentServer().hostname;
  const availableContracts = ns.ls(currentServer, ".cct");

  if (availableContracts.length === 0) {
    ns.print("No contracts found on server: " + currentServer);
    return;
  }

  let chosenContract: string;
  if (availableContracts.length === 1) {
    chosenContract = availableContracts[0];
  } else {
    chosenContract = await ns.prompt("Which contract?", {type: "select", choices: availableContracts}) as string;
  }

  // No contract was selected
  if (chosenContract.length === 0) { return; }

  const contractData = new ContractWrapper(ns, currentServer, chosenContract);
  if (contractData.solver.finished) {
    const autoSolve = await ns.prompt("Solver finished; complete automatically?", {type: "boolean"}) as boolean;
    if (autoSolve) {
      await contractData.attemptToSolve(ns);
    }
  } else {
    ns.print("Contract type: " + contractData.type);
    ns.print("Contract description:\n" + contractData.description);
    ns.print("Contract data:\n" + typeof contractData.data + ": " + JSON.stringify(contractData.data, jsonReplacer));
  }
  ns.print("Calculated solution is:\n" + JSON.stringify(await contractData.getSolution(ns), jsonReplacer));
}
