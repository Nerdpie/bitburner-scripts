/* Set of helpers for manipulating the `tail` windows */

// FIXME Doesn't work properly if the script has already finished...

import {RunningScript} from "NetscriptDefinitions";

export const CollapseState = {
  Ignore: -1,
  Open: 0,
  Close: 1
}

export function collapseTail(script: RunningScript): void {
  const doc: Document = globalThis['document']

  // Find the heading element
  let heading = doc.querySelector("h6[title='" + script.title + "']");
  let button = heading?.parentElement.querySelector("button[title='Collapse']")

  if (button) {
    // @ts-ignore  Yes, there is TOO a `click` function...
    button.click();
  }
}

export function expandTail(script: RunningScript): void {
  const doc: Document = globalThis['document']

  // Find the heading element
  let heading = doc.querySelector("h6[title='" + script.title + "']");
  let button = heading?.parentElement.querySelector("button[title='Expand']")

  if (button) {
    // @ts-ignore  Yes, there is TOO a `click` function...
    button.click();
  }
}