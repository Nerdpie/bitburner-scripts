/**
 * Get the unique values in an array
 * @param {Array} a
 * @return {Array} Unique values from the input array
 * @link https://stackoverflow.com/q/1960473 - Reference
 */
export function arrayUnique(a: any[]): any[] {
  return [...new Set(a)];
}

// REFINE Needs a better name...
/**
 * Create a typed multidimensional array with the given fill value
 * @param rows
 * @param columns
 * @param fillValue
 */
export function newMultidimensionalArray<T>(rows: number, columns: number, fillValue: T): T[][] {
    return Array(rows).fill(0).map(() => Array<T>(columns).fill(fillValue));
}