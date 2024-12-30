/**
 * Script to iterate over hosts and list contracts
 */

import {Contracts, setTailWindow} from "@settings"
import {getAllServers} from "@lib/scan_servers"
import React, {ReactNode} from "react";
import {ServerLink} from "@lib/ui/server_link";

export async function main(ns: NS): Promise<void> {
  setTailWindow(ns, Contracts);

  const DISABLED_LOGS = [
    'scan'
  ];
  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const servers = getAllServers(ns);


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