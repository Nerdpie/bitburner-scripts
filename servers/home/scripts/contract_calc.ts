import type {PlayerObject}           from "@/game_internal_types/PersonObjects/Player/PlayerObject";
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

  const player = <PlayerObject>globalThis.Player;
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
    chosenContract = <string>await ns.prompt("Which contract?", {type: "select", choices: availableContracts});
  }

  // No contract was selected
  if (chosenContract.length === 0) { return; }

  const contractData = new ContractWrapper(ns, currentServer, chosenContract);
  if (contractData.solver.finished) {
    const autoSolve = <boolean>await ns.prompt("Solver finished; complete automatically?", {type: "boolean"});
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
