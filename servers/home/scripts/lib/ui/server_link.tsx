import React from "react";
import {exposeGameInternalObjects} from "@/servers/home/scripts/lib/exploits";

export function ServerLink({dashes = '', hostname, decorator = ''}): React.ReactElement {
  if (!globalThis.Terminal) {
    exposeGameInternalObjects();
  }

  return (
    <div className="MuiTypography-root MuiTypography-body1">
      {dashes}
      <a onClick={() => globalThis.Terminal.connectToServer(hostname)}
         className="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineAlways">{hostname}</a>
      {decorator}
    </div>
  )
}

