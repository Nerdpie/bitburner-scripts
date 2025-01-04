import {comparePairs} from "@lib/comparators";

/**
 * @param {[number,number][]} input
 */
export function mergeOverlappingPairs(input: [number, number][]): [number, number][] {
  // REFINE Evaluate use of `shift` so we don't have to reverse it
  // Leaving for now since it seems to be working fine.

  // Sorted in reverse because we will be using `pop`
  const sorted = input.sort(comparePairs).reverse();
  const merged: [number, number][] = [];

  let temp = sorted.pop();
  if (!temp) {
    return [];
  }
  let lower = temp[0];
  let upper = temp[1];

  // I'm sure there's a better algorithm; I'm just going off my manual process
  while (temp) {
    // Only checking one 'edge' since it's already sorted
    if (lower <= temp[0] && temp[0] <= upper) {
      upper = Math.max(upper, temp[1]);
    } else {
      merged.push([lower, upper]);
      lower = temp[0];
      upper = temp[1];
    }

    // Get the next element to check
    temp = sorted.pop();
  }

  // Add in our final pair
  merged.push([lower, upper]);

  return merged;
}
