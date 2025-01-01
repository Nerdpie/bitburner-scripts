/**
 * Discovers all servers connected to the starting server ("home"), using a depth-first search.
 * Unique servers are recorded to ensure each is processed only once.
 * @param {NS} ns - The namespace object for accessing game functions.
 * @returns {string[]} An array of unique server names.
 */
export function getAllServers(ns: NS): string[] {
  const oldLogStatus = ns.isLogEnabled('scan');
  ns.disableLog('scan');
  const servers: string[] = [];
  const stack = ['home'];

  while (stack.length > 0) {
    const CURRENT = stack.pop();
    if (!servers.includes(CURRENT)) {
      servers.push(CURRENT);
      stack.push(...ns.scan(CURRENT).filter(next => !servers.includes(next)));
    }
  }

  if (oldLogStatus) {
    ns.enableLog('scan');
  }
  return servers;
}
