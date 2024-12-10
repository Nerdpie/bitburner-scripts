export async function main(ns: NS): Promise<void> {
  ns.ramOverride(64); // Give ourselves wiggle room
  const command = <string>await ns.prompt("Command to run", {type: "text"});
  if (command) {
    // noinspection DynamicallyGeneratedCodeJS - Yeah, that's the point in this case
    ns.print(eval(command));
  }
}