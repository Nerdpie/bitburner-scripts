import {Run} from "@/servers/home/scripts/settings"

export async function main(ns: NS): Promise<void> {
  ns.tail();
  ns.clearLog();

  const config = Run;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);
  ns.setTitle("Run Menu")

  // Exclude our contract solvers and library files
  const filteredFiles = ns.ls('home', '.js')
    .filter(file => !file.match('(solvers|lib|Temp)/'));

  const script: string = <string>await ns.prompt("Script path", {type: "select", choices: filteredFiles});

  if (script) {
    ns.run(script);
  }

}