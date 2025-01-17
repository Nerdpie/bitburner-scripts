/* Set of helpers for manipulating the `tail` windows */

export enum CollapseState {
  Ignore,
  Expand,
  Collapse
}

function findButtonAndClick(scriptTitle: string, buttonTitle: string) {
  const doc: Document = globalThis["document"];

  // Find the heading element
  const heading = doc.querySelector(`h6[title='${scriptTitle}']`);
  if (!heading) { return; }
  if (!heading.parentElement) {
    throw new Error(`Tail window heading does not have a parent element!\nTitle attribute: ${scriptTitle}`);
  }

  const button = heading.parentElement.querySelector<HTMLButtonElement>(`button[title='${buttonTitle}']`);

  if (button) {
    button.click();
  }
}

export function collapseTail(scriptTitle: string): void {
  findButtonAndClick(scriptTitle, "Collapse");
}

export function expandTail(scriptTitle: string): void {
  findButtonAndClick(scriptTitle, "Expand");
}

export function closeTail(scriptTitle: string): void {
  findButtonAndClick(scriptTitle, "Close window");
}

export function isTailOpen(scriptTitle: string): boolean {
  const doc: Document = globalThis["document"];

  // Find the heading element
  const heading = doc.querySelector(`h6[title='${scriptTitle}']`);

  return !!heading;
}
