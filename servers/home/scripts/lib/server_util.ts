import {Server} from 'NetscriptDefinitions';

/*
While the return values of the `assert` functions can be ignored, using them as traditional `assert` methods,
they can ALSO be used as a cleaner way of having the check for `undefined` where it is not expected.

By contrast, the `try` functions will treat an `undefined` property as an arbitrarily-chosen default.
Note that they do NOT behave in the same manner as, say, `tryParse` in some languages,
where the return value is whether the function succeeded, and the result is returned by reference.
 */

export function assertServerProperties(server: Server): Required<Server> {
  /*
  These keys are optional on a base Server object,
  but should be present on any non-purchased server:
   */
  const OPTIONAL_PROPERTIES_TO_CHECK = [
    'baseDifficulty',
    'hackDifficulty',
    'minDifficulty',
    'moneyAvailable',
    'moneyMax',
    'numOpenPortsRequired',
    'openPortCount',
    'requiredHackingSkill',
    'serverGrowth',
  ];
  OPTIONAL_PROPERTIES_TO_CHECK.forEach(prop => {
    if (server[prop] === undefined) {
      throw new Error(`Server with '${prop}' not specified: ${server.hostname}`);
    }
  });
  // ... TypeScript can't logic that the above loop guarantees that all the properties are present.
  return server as Required<Server>;
}

/**
 * @param server
 * @throws Error if the `backdoorInstalled` property is undefined
 */
export function assertBackdoorInstalled(server: Server): boolean {
  if (server.backdoorInstalled === undefined) {
    throw new Error(`Server with 'backdoorInstalled' not specified: ${server.hostname}`);
  }
  return server.backdoorInstalled;
}

/**
 * @param server
 * @param defaultValue The value to return if the `backdoorInstalled` property is undefined
 */
export function tryBackdoorInstalled(server: Server, defaultValue: boolean = false): boolean {
  if (server.backdoorInstalled === undefined) {
    return defaultValue;
  }
  return server.backdoorInstalled;
}

export function assertRequiredHackingSkill(server: Server): number {
  if (server.requiredHackingSkill === undefined) {
    throw new Error(`Server with 'requiredHackingSkill' not specified: ${server.hostname}`);
  }
  return server.requiredHackingSkill;
}

export function tryRequiredHackingSkill(server: Server, defaultValue: number = 0): number {
  if (server.requiredHackingSkill === undefined) {
    return defaultValue;
  }
  return server.requiredHackingSkill;
}

export function assertNumOpenPortsRequired(server: Server): number {
  if (server.numOpenPortsRequired === undefined) {
    throw new Error(`Server with 'numOpenPortsRequired' not specified: ${server.hostname}`);
  }
  return server.numOpenPortsRequired;
}

export function tryNumOpenPortsRequired(server: Server, defaultValue: number = 0): number {
  if (server.numOpenPortsRequired === undefined) {
    return defaultValue;
  }
  return server.numOpenPortsRequired;
}
