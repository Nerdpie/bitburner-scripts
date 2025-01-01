/**
 * Helper to sort pairs of numbers
 * @param {number[]} a
 * @param {number[]} b
 * @return {number} Negative if `a` is less than `b`, 0 if equal, and positive if `b` is less than `a`
 */
export function comparePairs(a: [number, number], b: [number, number]): number {
  if (a[0] === b[0]) {
    return a[1] - b[1];
  } else {
    return a[0] - b[0];
  }
}

// Kept only as a reference; will typically just write in-line
/**
 * Helper to compare pairs of numbers
 * @param {number} a
 * @param {number} b
 * @return {number} Negative if `a` is less than `b`, 0 if equal, and positive if `b` is less than `a`
 */
export function compareNumbers(a: number, b: number): number {
  return a - b;
}
