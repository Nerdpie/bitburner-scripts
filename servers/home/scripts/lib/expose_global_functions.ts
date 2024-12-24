import {sprintf, vsprintf} from "sprintf-js";

/**
 * Add any methods that are available globally to this definition;
 * we WILL NOT invoke this script directly; it just tricks the IntelliSense
 * @param _ns
 */
export async function main(_ns: NS): Promise<void> {
  globalThis.sprintf = sprintf;
  globalThis.vsprintf = vsprintf;
}