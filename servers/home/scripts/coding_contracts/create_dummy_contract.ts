import {CodingContractTypes} from "./contract_util";

export async function main(ns: NS): Promise<void> {
  if (ns.self().parent !== 0) {
    // We are either run from the 'run menu', or re-run from a tail window
    ns.tail();
  }

  if (ns.self().tailProperties) {
    const contractType = <string>await ns.prompt("Contract type:", {
      type: "select",
      choices: Object.keys(CodingContractTypes).toSorted(),
    });
    if (contractType) {
      ns.codingcontract.createDummyContract(contractType);
    }
    return;
  }

  // Not run from our 'run menu', nor from a tail window; use args
  const type = ns.args[0];

  if (typeof type === "string") {
    const contractType = type.replace(/_/g, " ");
    ns.codingcontract.createDummyContract(contractType);
  } else {
    ns.tprintf(`ERROR: Please specify a string for the contract type`);
  }
}

export function autocomplete(): string[] {
  return Object.keys(CodingContractTypes).toSorted().map(t => t.replace(/ /g, "_"));
}
