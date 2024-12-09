/**
   * Discovers all servers connected to the starting server ("home"), using a depth-first search.
   * Unique servers are recorded to ensure each is processed only once.
   * @param {NS} ns - The namespace object for accessing game functions.
   * @returns {string[]} An array of unique server names.
   */
export function getAllServers(ns) {
  let oldLogStatus = ns.isLogEnabled('scan');
  ns.disableLog('scan');
  let servers = [];
  let stack = ["home"];

  while (stack.length > 0) {
    const CURRENT = stack.pop();
    if (!servers.includes(CURRENT)) {
      servers.push(CURRENT);
      stack.push(...ns.scan(CURRENT).filter(next => !servers.includes(next)));
    }
  }

  if (oldLogStatus) ns.enableLog('scan');
  return servers;
}

// FIXME Move this to a UI library section
function ServerLink({ dashes, hostname, decorator }) {
  return React.createElement(
    'div',
    { className: 'MuiTypography-root MuiTypography-body1' },
    dashes,
    React.createElement('a',
      {
        className: 'MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineAlways',
        onClick: () => globalThis.Terminal.connectToServer(hostname)
      },
      hostname
    ),
    decorator
  );
}

/** 
 * @param {NS} ns
 * @param {number} depth
 * @param {boolean} all
 */
export function scanAnalyzeInternals(ns, depth = 1, all = false) {
  ns.disableLog('getHackingLevel');
  const PLAYER_HACK_LEVEL = ns.getHackingLevel();

  class Node {
    // I don't like this being a recursive constructor, but w/e...
    /**
     * @param {string} parent
     * @param {Server} server
     * @param {number} depth
     */
    constructor(parent, server, depth = 1) {
      this.#server = server;
      this.hostname = server.hostname;
      this.children = ns.scan(server.hostname)
        .filter((h) => h != parent)
        .map((s) => ns.getServer(s))
        .filter((v) => !!v)
        .filter((v) => !ignoreServer(v, depth))
        .map((h) => new Node(server.hostname, h, depth + 1));
      this.decorator = this.statusDecorator();
    }

    /** @type {Server} */
    #server;
    hostname = "";
    /** @type {Node[]} */
    children = [];
    decorator = "";

    /** @type {boolean} */
    canBackdoor() {
      return this.#server.requiredHackingSkill <= PLAYER_HACK_LEVEL && !this.#server.purchasedByPlayer
    }

    statusDecorator() {
      let decor = ''
      if (this.#server.hasAdminRights) {
        decor = ' (+'
        decor += this.#server.backdoorInstalled ? '*' : this.canBackdoor() ? '!' : ''
        decor += ')'
      }
      return decor
    }
  }

  /**
   * @param {Server} s
   * @param {number} d
   * @return {boolean}
   */
  // TODO Revisit once we unlock hacknet SERVERS
  const ignoreServer = (s, d) =>
    (!all && s.purchasedByPlayer && s.hostname != "home") || d > depth /*|| (!all && s instanceof HacknetServer)*/;

  // MEMO Hard-coded 'home' since it was throwing errors...
  const root = new Node('home', ns.getServer('home'));

  /**
   * @param {Node} node
   * @param {string} prefix
   * @param {boolean} last
   */
  const printOutput = (node, prefix = ["  "], last = true) => {
    const titlePrefix = prefix.slice(0, prefix.length - 1).join("") + (last ? "┗ " : "┣ ");
    const infoPrefix = prefix.join("") + (node.children.length > 0 ? "┃   " : "    ");

    const REACT_ELEMENTS = true;
    if (REACT_ELEMENTS) {
      const element = React.createElement(ServerLink, {
        dashes: titlePrefix,
        hostname: node.hostname,
        decorator: node.decorator
      })
      ns.printRaw(element);
    }
    else {
      ns.print(titlePrefix + node.hostname + node.decorator + "\n");
    }

    const server = ns.getServer(node.hostname);
    if (!server) return;

    // Interpolation is fun, but it can get messy, esp. if you want alignment...
    //ns.printf(`${infoPrefix}Pwn: ${server.hasAdminRights}` + "\n");
    //ns.printf("%sPwn: %5s BD: %5s", infoPrefix, server.hasAdminRights, server.backdoorInstalled);

    node.children.forEach((n, i) =>
      printOutput(n, [...prefix, i === node.children.length - 1 ? "  " : "┃ "], i === node.children.length - 1),
    );
  };

  printOutput(root);
}