/**
 * Init script to reset Nerdpie's sessions
 *
 */

import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits"
import {closeTail, CollapseState, collapseTail, expandTail, isTailOpen} from "@/servers/home/scripts/lib/tail_helpers"
import {AutocompleteData, RunOptions} from "NetscriptDefinitions";
import {FlagSchemaType} from "@/servers/home/scripts/lib/enum_and_limiter_definitions";

interface DefaultScriptCtorParams {
  script: string;
  collapse?: CollapseState;
  shouldRun?: boolean;
  threadOrOptions?: number | RunOptions;
  args?: string[];
}

/** Holder for settings for default scripts to launch */
class DefaultScript {
  /**
   * @param script
   * @param collapse
   * @param shouldRun
   * @param threadOrOptions
   * @param args
   */
  constructor({script, collapse=CollapseState.Ignore, shouldRun=true, threadOrOptions=1, args=[]}: DefaultScriptCtorParams) {
    if (script.charAt(0) === '/') {
      this.script = script.substring(1);
    } else {
      this.script = script;
    }
    this.collapse = collapse;
    this.shouldRun = shouldRun;
    this.threadOrOptions = threadOrOptions;
    this.runArgs = args;
  }

  private readonly script: string;
  private readonly collapse: CollapseState;
  private readonly shouldRun: boolean;
  private readonly threadOrOptions: number | RunOptions;
  private readonly runArgs: string[];

  /**
   * The `title` attribute used in tail windows
   * @private
   */
  private get titleAttribute(): string {
    // Derived from bitburner-src/src/Script/RunningScript.ts
    if (!this.runArgs || this.runArgs.length < 1) {
      return `${this.script} `;
    }
    return `${this.script} ${this.runArgs?.join(' ')}`;
  }

  /** @param {NS} ns */
  ensureScriptRunning(ns: NS): void {
    if (!this.shouldRun) {
      ns.tprintf("Skipping: %s", this.script);
      return;
    }

    // Just eat the RAM cost; not sure what wasn't matching for `ns.ps`...
    if (ns.isRunning(this.script, 'home', ...this.runArgs)){
      ns.tprintf("Already running: %s", this.script);

    } else {
      ns.tprintf("Not running: %s", this.script);

      // Reset the existing tail windows
      if (isTailOpen(this.titleAttribute)) {
        closeTail(this.titleAttribute);
      }

      ns.run(this.script, this.threadOrOptions, ...this.runArgs);
    }
  }

  async ensureTailState(ns: NS): Promise<void> {
    if (!isTailOpen(this.titleAttribute)) {
      if (this.collapse === CollapseState.Ignore) {
        return;
      }
      ns.tail(this.script, 'home', ...this.runArgs);

      // Ensure that the tail window has time to render before we try to act on it
      await ns.sleep(10);
    }

    // REFINE Have this also ensure the position of the tail windows

    switch (this.collapse) {
      case CollapseState.Collapse:
        collapseTail(this.titleAttribute);
        break;
      case CollapseState.Expand:
        expandTail(this.titleAttribute);
        break;
      case CollapseState.Ignore:
        break;
    }
  }
}

function setCustomStyle() {

  const doc: Document = globalThis['document'];
  const styleId = 'nerdpie-css';
  let customStyle = doc.getElementById(styleId);

  // Ensure the style element is generated; if it already exists, we'll just reset the contents
  if (!customStyle) {
    customStyle = doc.body.appendChild(doc.createElement("style"));
    customStyle.id = "nerdpie-css";
  }
  // noinspection CssUnusedSymbol,SpellCheckingInspection
  // language=CSS
  customStyle.textContent = `
@import "https://www.nerdfonts.com/assets/css/webfont.css";
/* Tweak the CSS for the view so it doesn't hide behind core info as much */
#root > div.MuiBox-root > div.MuiBox-root { 
  margin-right: 400px; 
}

/* Hide the NiteSec ASCII art; it's cool, but it disrupts the flow from other menus */
#root > div.MuiBox-root > div.MuiBox-root > p.MuiTypography-root.MuiTypography-body1[class$='noformat']:not(:has(div,p)) {
  display: none;
}
`;
}

function setCustomPS1() {
  // Based in part on Shy's code at https://github.com/shyguy1412/bb-scripts/blob/468b5732e6be176fc3d8740e2e2f6e2fe1f42880/src/lib/BitburnerDOM.ts#L32
  const observer = new MutationObserver(mutations => {

    mutations.forEach(mutation => {

    })

  })

  const doc: Document = globalThis['document'];
  const terminalInput = doc.getElementById('terminal-input');
  const promptNodes = terminalInput.parentElement.firstElementChild.childNodes;
  /*
  Example nodes: '[','the-hub',' /','',']> '
   */
  terminalInput.parentElement.onchange
}

const FLAG_SCHEMA: FlagSchemaType = [
  ['killall-scripts', false]
]

export async function main(ns: NS): Promise<void> {
  if (ns.getHostname() !== 'home') {
    ns.tprint(`ERROR: Init must only be run on 'home'!`);
    return;
  }

  const flags = ns.flags(FLAG_SCHEMA);

  if (flags['killall-scripts']) {
    const self = ns.self();
    ns.ps().filter(p => p.pid !== self.pid)
      .forEach(p => ns.kill(p.pid));
  }

  setCustomStyle();

  if (!globalThis.Terminal) {
    exposeGameInternalObjects()
  }

  //setCustomPS1();

  // TODO Determine any other conditions to limit other scripts being run, such as RAM capacity
  const scripts = [
    new DefaultScript({script : "/scripts/custom_hud.js"}),
    new DefaultScript({script : "/scripts/scan_files.js", args : ["--scrape"]}),
    new DefaultScript({script : "/scripts/coding_contracts/contract_dispatcher.js", collapse : CollapseState.Collapse}),
    new DefaultScript({script : "/scripts/scan_contracts.js", collapse : CollapseState.Collapse}),
    new DefaultScript({script : "/scripts/augments.js", collapse : CollapseState.Collapse}),
    //new DefaultScript({script : "/scripts/net_tree.js", collapse : CollapseState.Collapse}),
    new DefaultScript({script : "/scripts/run_menu.js", collapse : CollapseState.Collapse}),
    new DefaultScript({script : "/z_from_others/insight/go.js"}),
    new DefaultScript({script : "/scripts/gang_lord.js", collapse : CollapseState.Collapse, shouldRun : ns.gang.inGang()}),
    new DefaultScript({script : "/scripts/deploy.js", collapse : CollapseState.Expand}),
  ]

  scripts.forEach(s => s.ensureScriptRunning(ns));

  await ns.sleep(10);

  for (const s of scripts) {
    await s.ensureTailState(ns);
  }

}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
  data.flags(FLAG_SCHEMA);
  return [];
}