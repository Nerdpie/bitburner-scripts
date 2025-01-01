import {ServerLink}             from '@lib/ui/server_link';
import {NetTree, setTailWindow} from '@settings';
import type {Server}            from 'NetscriptDefinitions';
import type {ReactNode}         from 'react';
import React                    from 'react';

/** @param {NS} ns */
export function main(ns: NS): void {
  setTailWindow(ns, NetTree);

  ns.disableLog('disableLog');
  ns.disableLog('scan');
  scanAnalyzeInternals(ns, Number.MAX_SAFE_INTEGER);
}

/**
 * Heavily modified from the internal implementation of the `scan-analyze` command
 * @param {NS} ns
 * @param {number} depth
 * @param {boolean} all
 */
function scanAnalyzeInternals(ns: NS, depth: number = 1, all: boolean = false): void {
  ns.disableLog('getHackingLevel');
  const PLAYER_HACK_LEVEL = ns.getHackingLevel();

  class Node {
    hostname: string;
    children: Node[];
    decorator: string;
    branchDepth: number;
    #server: Server;

    // I don't like this being a recursive constructor, but w/e...
    /**
     * @param {string} parent
     * @param {Server} server
     * @param {number} depth
     */
    constructor(parent: string, server: Server, depth: number = 1) {
      this.#server = server;
      this.hostname = server.hostname;
      this.children = ns.scan(server.hostname)
        .filter((h: string) => h !== parent)
        .map((s: string) => ns.getServer(s))
        .filter((v: Server) => !!v)
        .filter((v: Server) => !ignoreServer(v, depth))
        .map((h: Server) => new Node(server.hostname, h, depth + 1));
      this.decorator = this.statusDecorator();
      if (this.children.length === 0) {
        this.branchDepth = 0;
      } else {
        this.branchDepth = this.children.map(n => n.branchDepth).reduce((acc, bd) => Math.max(acc, bd)) + 1;
      }
    }

    get #canBackdoor(): boolean {
      return this.#server.requiredHackingSkill <= PLAYER_HACK_LEVEL && !this.#server.purchasedByPlayer;
    }

    statusDecorator(): string {
      let decor = '';
      if (this.#server.hasAdminRights) {
        decor = ' (+';
        // This line is a mixed bag; it's not TOO heinous, and the equivalent if-else is messy
        // noinspection NestedConditionalExpressionJS
        decor += this.#server.backdoorInstalled ? '*' : this.#canBackdoor ? '!' : '';
        decor += ')';
      }
      return decor;
    }
  }

  // TODO Revisit once we unlock hacknet SERVERS
  function ignoreServer(s: Server, d: number): boolean {
    // noinspection OverlyComplexBooleanExpressionJS
    return !all && s.purchasedByPlayer && s.hostname !== 'home' || d > depth; /*|| (!all && s instanceof HacknetServer)*/
  }

  // MEMO Hard-coded 'home' since it was throwing errors...
  const root = new Node('home', ns.getServer('home'));

  function printOutput(node: Node, prefix: string[] = ['  '], last: boolean = true) {
    const titlePrefix = prefix.slice(0, prefix.length - 1).join('') + (last ? '┗ ' : '┣ ');

    const REACT_ELEMENTS = true;
    if (REACT_ELEMENTS) {
      const element: ReactNode = React.createElement(ServerLink, {
        dashes: titlePrefix,
        hostname: node.hostname,
        decorator: node.decorator
      });
      // @ts-expect-error It is the right type, just a placeholder definition...
      ns.printRaw(element);
    } else {
      ns.print(titlePrefix + node.hostname + node.decorator + '\n');
    }

    const server = ns.getServer(node.hostname);
    if (!server) {
      return;
    }

    // Sort display by branch depth (shallowest first), then by hostname
    node.children.sort((a, b) => a.hostname.localeCompare(b.hostname))
      .sort((a, b) => a.branchDepth - b.branchDepth)
      .forEach((n, i) =>
        printOutput(n, [...prefix, i === node.children.length - 1 ? '  ' : '┃ '], i === node.children.length - 1)
      );
  }

  printOutput(root);
}
