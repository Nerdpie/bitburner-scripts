import { ScriptSettings } from "servers/home/scripts/settings"

  /** @param {NS} ns */
export async function main(ns) {
ns.tail();
ns.clearLog();

  let config = ScriptSettings.run;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);
  ns.setTitle("Run Menu")

  let script = await ns.prompt("Script path", {type: "select", choices: ns.ls('home','.js')});

  if (script) {
    ns.run(script);
  }

}