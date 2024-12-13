/* Set of helpers for manipulating the `tail` windows */

// FIXME Doesn't work properly if the script has already finished...

import {RunningScript} from "NetscriptDefinitions";

export enum CollapseState {
  Ignore,
  Open,
  Close
}

export function collapseTail(script: RunningScript): void {
  const doc: Document = globalThis['document']

  // Find the heading element
  const heading = doc.querySelector("h6[title='" + script.title + "']");
  const button = heading?.parentElement.querySelector("button[title='Collapse']");

  if (button) {
    // @ts-ignore  Yes, there is TOO a `click` function...
    button.click();
  }
}

export function expandTail(script: RunningScript): void {
  const doc: Document = globalThis['document']

  // Find the heading element
  const heading = doc.querySelector("h6[title='" + script.title + "']");
  const button = heading?.parentElement.querySelector("button[title='Expand']");

  if (button) {
    // @ts-ignore  Yes, there is TOO a `click` function...
    button.click();
  }
}