/**
 * Init script to reset Nerdpie's sessions
 * 
 */

import { exposeGameInternalObjects } from "servers/home/scripts/lib/exploits"
import { collapseTail, CollapseState } from "servers/home/scripts/lib/tail_helpers"


/** Holder for settings for default scripts to launch */
class DefaultScript {
  /** 
   * @param {string} script
   * @param {number} collapse
   * @param {number | RunOptions} threadOrOptions
   */
  constructor(script, collapse = CollapseState.Ignore, threadOrOptions = 1, ...args) {
    this.#script = script;
    this.#collapse = collapse;
    this.#threadOrOptions = threadOrOptions;
    this.#runArgs = args;
  }

  #script;
  #threadOrOptions; // Optional, number | RunOptions
  #collapse;
  #runArgs;

  // TODO Adjust this to also check for windows from killed scripts
  /** @param {NS} ns */
  ensureScriptRunning(ns) {
    ns.tprintf("Checking for: %s", this.#script);
    let checkArgs = [this.#script, 'home', this.#runArgs].flat();
    if (!ns.getRunningScript.apply(ns, checkArgs)) {
      ns.tprintf("Not running: %s", this.#script);
      let argArray = [this.#script, this.#threadOrOptions, this.#runArgs].flat();
      let pid = ns.run.apply(ns, argArray)

      if (this.#collapse === CollapseState.Close) {
        let scriptRef = ns.getRunningScript(pid);
        // TODO Handle the script already having finished running...
        collapseTail(scriptRef);
      }
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  // TODO Kill all scripts (other than ourself!) on the local host

  // Tweak the CSS for the view so it doesn't hide behind core info as much
  /** @type {Document} */
  const doc = eval('document');
  const marginStyle = doc.body.appendChild(doc.createElement("style"));
  marginStyle.textContent = "#root > div.MuiBox-root > div.MuiBox-root { margin-right: 400px }";

  const scripts = [
    new DefaultScript("/scripts/deploy.js"),
    new DefaultScript("/scripts/custom_hud.js"),
    //new DefaultScript("/scripts/hacknet_manager.js", CollapseState.Close),
    new DefaultScript("/scripts/scan_files.js", CollapseState.Ignore, 1, "--scrape"),
    new DefaultScript("/scripts/scan_contracts.js", CollapseState.Close),
    new DefaultScript("/scripts/augments.js", CollapseState.Close),
    new DefaultScript("/scripts/net_tree.js", CollapseState.Close),
    new DefaultScript("/scripts/run_menu.js", CollapseState.Close)
  ]

  scripts.forEach(s => s.ensureScriptRunning(ns));

  // TODO Determine a clean way to also open our default set of scripts in the editor

  if (!globalThis.Terminal) {
    exposeGameInternalObjects()
  }

  const DEFAULT_FILES = [
    '/scripts/settings.js',
    '/scripts/TODO.js',
    '/scripts/scratchpad.js',
    '/scripts/contract_calc.js'
  ]

  if (globalThis.Terminal.action) {
    ns.alert("Terminal busy; cannot open default editors\nPlease try again");
  } else if (!ns.getServer('home').isConnectedTo) {
    ns.alert("Cannot open files while not connected to 'home'!");
  } else {
    // `nano` doesn't work right if we try to chain it; only opens the first one?
    DEFAULT_FILES.map(f => 'nano ' + f).forEach(f =>
      globalThis.Terminal.executeCommands(f)
    )
  }

}