/* Set of helpers for manipulating the `tail` windows */

// FIXME Doesn't work properly if the script has already finished...

export const CollapseState = {
  Ignore: -1,
  Open: 0,
  Close: 1
}

/** @param {RunningScript} script */
export function collapseTail(script) {
  const doc = eval("document")

  // Find the heading element
  let heading = doc.querySelector("h6[title='" + script.title + "']");
  let button = heading?.parentElement.querySelector("button[title='Collapse']")

  if (button) { button.click(); }
}

/** @param {RunningScript} script */
export function expandTail(script) {
  const doc = eval("document")

  // Find the heading element
  let heading = doc.querySelector("h6[title='" + script.title + "']");
  let button = heading?.parentElement.querySelector("button[title='Expand']")

  if (button) { button.click(); }
}

/** @param {NS} ns */
export async function main(ns) {
  
}