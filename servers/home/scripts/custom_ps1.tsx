/**
 * Example of proposed syntax for custom PS1 support
 *
 * Outlined considerations:
 * The PS1 function should not have RAM impact
 * The PS1 function should, therefore, not have access to the `NS` namespace
 * To be effective as a shell prompt, we then must expose some data directly
 * To that end, we take a cue from the existing autocomplete implementation
 *
 * Once the player has created their PS1 script, we would use a command to store it;
 * whether that be an abuse of the command parser to treat `PS1=` as a command,
 * or a new command, is open to discussion.
 */

import React, {ReactNode} from "react";

// Property names are, of course, open to discussion
// The hostname and current directory are critical to provide;
//  other properties, such as attributes about the files in the directory,
//  MAY be useful if someone wants to implement markers akin to, say,
//  Git extensions to PS1; whether this should be exposed is up for debate.
export interface PS1Data {
  hostname: string;
  cwd: string;
}



// Whether the implementation would look for `ps1`, `shellPrompt`, or another name
// is, like much of this draft, open for discussion.
export function ps1(data: PS1Data): string | ReactNode {
  // In my case, I have another script that injects a custom CSS style,
  // which includes an import for the Nerd Fonts web font
  return React.createElement(PS1Element, {data: data});
}

function PS1Element({data}: {data: PS1Data}): React.ReactElement {
  let pathParts: string[];
  if (data.cwd.length > 0 && data.cwd.charAt(0) === '/') {
    pathParts = data.cwd.substring(1).split('/')
  } else {
    pathParts = data.cwd.split('/');
  }

  return (
    <span>
      neo@{data.hostname}
      <i className={'nf nf-ple-pixelated_squares_big'} />
      {pathParts.map(part => (
        <>{part}<i className={'nf nf-ple-honeycomb'} /></>
      ))}
    </span>
  )
}



export async function main(ns: NS): Promise<void> {
  const data: PS1Data = {
    hostname: ns.getHostname(),
    cwd: globalThis.Terminal.cwd() // Webpack exploit
  }
  // @ts-ignore Difference between the actual React type, and the NetscriptDefinitions type
  ns.printRaw(ps1(data));
}