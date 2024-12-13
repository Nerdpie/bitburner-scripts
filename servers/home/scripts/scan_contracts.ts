/**
 * Script to iterate over hosts and list contracts
 */

import {Contracts} from "@/servers/home/scripts/settings"
import {getAllServers} from "@/servers/home/scripts/lib/scan_servers"
import React, {ReactNode} from "react";
import {ServerLink} from "@/servers/home/scripts/lib/ui/server_link";

export async function main(ns: NS): Promise<void> {
  const DISABLED_LOGS = [
    'scan'
  ];

  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const servers = getAllServers(ns);

  ns.clearLog();
  ns.tail();

  const config = Contracts;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  servers.forEach(server => {
    const files = ns.ls(server)
      .filter(f => f.endsWith('.cct'));

    if (files.length > 0) {
      const element: ReactNode = React.createElement(ServerLink, {
        hostname: server
      });
      // @ts-ignore It is the right type, just a placeholder definition...
      ns.printRaw(element);

      for (let i = 0; i < files.length; i++) {
        if (i < files.length - 1) {
          ns.print("┣ " + files[i]);
        } else {
          ns.print("┗ " + files[i]);
        }
      }
    }
  })
}