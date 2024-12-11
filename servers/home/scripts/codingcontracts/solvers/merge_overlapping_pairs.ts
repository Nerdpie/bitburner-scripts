import {comparePairs} from "@/servers/home/scripts/lib/comparators";

/**
 * @param {NS} ns
 * @param {number[][]} input
 */
export function mergeOverlappingPairs(ns: NS, input: number[][]) {
  // TODO Evaluate use of `shift` so we don't have to reverse it
  // Sorted in reverse because we will be using `pop`
  let sorted = input.sort(comparePairs).reverse();
  let merged = [];

  let temp = sorted.pop();
  let lower = temp[0];
  let upper = temp[1];


  // I'm sure there's a better algorithm; I'm just going off my manual process
  while (temp) {
    /* ns.print('temp: ' + temp)
    ns.print('lower: ' + lower)
    ns.print('upper: ' + upper)
    ns.print('sorted: ' + sorted)
    ns.print('merged: ' + merged) */

    // Only checking one 'edge' since it's already sorted
    if (lower <= temp[0] && temp[0] <= upper) {
      upper = Math.max(upper, temp[1])
    } else {
      merged.push([lower, upper]);
      lower = temp[0];
      upper = temp[1];
    }

    // Get the next element to check
    temp = sorted.pop();
  }
  /* ns.print('temp: ' + temp)
  ns.print('lower: ' + lower)
  ns.print('upper: ' + upper)
  ns.print('sorted: ' + sorted)
  ns.print('merged: ' + merged) */

  // Add in our final pair
  merged.push([lower, upper]);

  ns.print(merged)

}