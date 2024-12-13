/**
 * Init script to reset Nerdpie's sessions
 * 
 */

import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits"
import {CollapseState, collapseTail} from "@/servers/home/scripts/lib/tail_helpers"
import {RunOptions} from "NetscriptDefinitions";


/** Holder for settings for default scripts to launch */
class DefaultScript {
  /**
   * @param {string} script
   * @param {number} collapse
   * @param {number | RunOptions} threadOrOptions
   * @param {string[]} args
   */
  constructor(script: string, collapse: CollapseState = CollapseState.Ignore, threadOrOptions: number | RunOptions = 1, ...args: string[]) {
    this.#script = script;
    this.#collapse = collapse;
    this.#threadOrOptions = threadOrOptions;
    this.#runArgs = args;
  }

  readonly #script: string;
  #threadOrOptions: number | RunOptions;
  readonly #collapse: CollapseState;
  #runArgs: string[];

  // TODO Adjust this to also check for windows from killed scripts
  /** @param {NS} ns */
  ensureScriptRunning(ns: NS): void {
    ns.tprintf("Checking for: %s", this.#script);
    const checkArgs = [this.#script, 'home', this.#runArgs].flat();
    if (!ns.getRunningScript.apply(ns, checkArgs)) {
      ns.tprintf("Not running: %s", this.#script);
      const argArray = [this.#script, this.#threadOrOptions, this.#runArgs].flat();
      const pid = ns.run.apply(ns, argArray);

      if (this.#collapse === CollapseState.Close) {
        const scriptRef = ns.getRunningScript(pid);
        // TODO Handle the script already having finished running...
        collapseTail(scriptRef);
      }
    }
  }
}

/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  // TODO Kill all scripts (other than ourself!) on the local host

  // Tweak the CSS for the view so it doesn't hide behind core info as much
  /** @type {Document} */
  const doc: Document = globalThis['document'];
  const marginStyle = doc.body.appendChild(doc.createElement("style"));
  marginStyle.textContent = "#root > div.MuiBox-root > div.MuiBox-root { margin-right: 400px }";

  const scripts = [
    new DefaultScript("/scripts/deploy.js", CollapseState.Open),
    new DefaultScript("/scripts/custom_hud.js", CollapseState.Ignore),
    new DefaultScript("/scripts/scan_files.js", CollapseState.Ignore, 1, "--scrape"),
    new DefaultScript("/scripts/codingcontracts/contract_dispatcher.js", CollapseState.Ignore),
    new DefaultScript("/scripts/scan_contracts.js", CollapseState.Close),
    new DefaultScript("/scripts/augments.js", CollapseState.Close),
    new DefaultScript("/scripts/net_tree.js", CollapseState.Close),
    new DefaultScript("/scripts/run_menu.js", CollapseState.Close)
  ]

  scripts.forEach(s => s.ensureScriptRunning(ns));

  // We use the exposed objects enough places; may as well launch in `init`
  if (!globalThis.Terminal) {
    exposeGameInternalObjects()
  }
}