import React from "react";
import {exposeGameInternalObjects} from "../exploits";

export function ServerLink({dashes = '', hostname, decorator = ''}): React.ReactElement {
  if (!globalThis.Terminal) {
    exposeGameInternalObjects();
  }
  // TODO We want this to have `cursor:pointer` and `text-decoration-line:underline`
  // However, apparently this generates a new CSS class for EACH use, if the style
  // is not defined outside of the 'render' call?
  // ... doesn't appear to.  Seems to just use an inline CSS.  W/e, will research
  return (
    <div className="MuiTypography-root MuiTypography-body1">
      {dashes}
      <a onClick={() => globalThis.Terminal.connectToServer(hostname)}
         className="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineAlways"
         >{hostname}</a>
      {decorator}
    </div>
  )
}

