import {sprintf, vsprintf} from "sprintf-js";

/**
 * Add any methods that are available globally to this definition;
 * we WILL NOT invoke this script directly; it just tricks the IntelliSense
 */
export function main(): void {
  globalThis.sprintf = sprintf;
  globalThis.vsprintf = vsprintf;
}
