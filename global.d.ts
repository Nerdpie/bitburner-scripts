// `var` is apparently necessary to expose properties on the various `global` references
// See: https://stackoverflow.com/a/68452689
/* eslint-disable no-var */
import {NS as _NS} from "NetscriptDefinitions";

// Default part of Shy's template
declare global {
  type NS = _NS;
}

// Globals exposed by `sprintf-js`
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var sprintf: (format: string, ...args: any[]) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var vsprintf: (format: string, args: any[]) => string;
}
