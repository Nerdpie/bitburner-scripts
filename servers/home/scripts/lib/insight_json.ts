// Taken from Insight's [helpers.js](https://github.com/alainbryden/bitburner-scripts/blob/main/helpers.js)
// Reformatted to meet our code style & inspections
// Disabling these inspections because, otherwise, the file would be 1/3 suppression comments...
/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument */

/** Allows us to serialize types not normally supported by JSON.serialize */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonReplacer(_key: never, val: any): any {
  if (val === Infinity) {
    return {$type: 'number', $value: 'Infinity'};
  }
  if (val === -Infinity) {
    return {$type: 'number', $value: '-Infinity'};
  }
  if (Number.isNaN(val)) {
    return {$type: 'number', $value: 'NaN'};
  }
  if (typeof val === 'bigint') {
    return {$type: 'bigint', $value: val.toString()};
  }
  if (val instanceof Map) {
    return {$type: 'Map', $value: [...val]};
  }
  if (val instanceof Set) {
    return {$type: 'Set', $value: [...val]};
  }
  if (val instanceof Date) {
    return {$type: 'Date', $value: val.toJSON()};
  }
  return val;
}

/** Allows us to deserialize special values created by the above jsonReplacer */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonReviver(_key: never, val: any): any {
  if (val === null || typeof val !== 'object' || val.$type === null) {
    return val;
  }
  if (val.$type === 'number') {
    return Number.parseFloat(val.$value);
  }
  if (val.$type === 'bigint') {
    return BigInt(val.$value);
  }
  if (val.$type === 'Map') {
    return new Map(val.$value);
  }
  if (val.$type === 'Set') {
    return new Set(val.$value);
  }
  if (val.$type === 'Date') {
    return new Date(val.$value);
  }
  return val;
}
