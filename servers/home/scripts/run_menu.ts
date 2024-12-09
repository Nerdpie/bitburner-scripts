import {ScriptSettings} from "@/servers/home/scripts/settings"

export async function main(ns: NS): Promise<void> {
  ns.tail();
  ns.clearLog();

  let config = ScriptSettings.run;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);
  ns.setTitle("Run Menu")

  let script: string = <string>await ns.prompt("Script path", {type: "select", choices: ns.ls('home', '.js')});

  if (script) {
    ns.run(script);
  }

}