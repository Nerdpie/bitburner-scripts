/**
 * Get the unique values in an array
 * @param {Array} a
 * @return {Array} Unique values from the input array
 * @link https://stackoverflow.com/q/1960473 - Reference
 */
export function arrayUnique(a: any[]): any[] {
  return [...new Set(a)];
}