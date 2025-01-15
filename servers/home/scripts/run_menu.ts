import {Run, setTailWindow} from "@settings";

export async function main(ns: NS): Promise<void> {
  const config = Run;
  setTailWindow(ns, config);

  // Exclude our contract solvers and library files
  const filteredFiles = ns.ls("home", ".js")
    .filter(file => !file.match(config.exclusionPattern));

  const script: string = await ns.prompt("Script path", {type: "select", choices: filteredFiles}) as string;

  if (script) {
    // Using `atExit` to work around the RAM usage of the run menu itself
    ns.atExit(() => ns.run(script));
  }
}
