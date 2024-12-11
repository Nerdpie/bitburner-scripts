// 2-coloring of a graph
import {comparePairs} from "@/servers/home/scripts/lib/comparators";
import {arrayUnique} from "@/servers/home/scripts/lib/array_util";

// TODO Write the two-color graph solver
export function twoColorGraph(ns: NS, input: Array<number | number[][]>): void {
  let numVertices: number = <number>input[0];
  let unsortedEdges: number[][] = <number[][]>input[1];
  let edges: number[][] = unsortedEdges.sort(comparePairs);
  let vertices: number[] = arrayUnique(edges.flat()).sort()

  ns.printf('numVertices: %d', numVertices);
  ns.print(edges);
  ns.print(vertices);

  // Get a bit of text we can dump into a DOT-compatible graph env
  edges.forEach(a => ns.print('  ' + a[0] + '-->' + a[1] + ';'))

  // Check if there are any obvious conflicts, e.g. a loop of an odd number of elements
  // Can do so by checking the list of neighbors: a.neighbors.foreach(n => n.neighbors.some(b => a.neighbors.includes(b)))

  // Alternatively, start by assigning the first vertex '0', then iterate neighbors.
  // If a neighbor is already assigned, just ensure it doesn't conflict.

}