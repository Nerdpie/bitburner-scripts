export async function main(ns: NS): Promise<void> {
  // noinspection MagicNumberJS
  ns.ramOverride(64); // Give ourselves wiggle room
  const command = await ns.prompt("Command to run", {type: "text"}) as string;
  if (command) {
    // noinspection DynamicallyGeneratedCodeJS - Yeah, that's the point in this case
    ns.print(eval(command));
  }
}
