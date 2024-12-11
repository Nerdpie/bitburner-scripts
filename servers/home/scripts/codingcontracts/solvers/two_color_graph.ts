// 2-coloring of a graph
import {comparePairs} from "@/servers/home/scripts/lib/comparators";
import {arrayUnique} from "@/servers/home/scripts/lib/array_util";

// TODO Write the two-color graph solver
export function twoColorGraph(ns: NS, input: Array<number | number[][]>): void {
  /* Sample description:
  You are given the following data, representing a graph:
 [10,[[0,8],[0,6],[1,6],[4,9],[0,3],[1,8],[4,5],[0,2]]]
 Note that "graph", as used here, refers to the field of graph theory,
 and has no relation to statistics or plotting.
 The first element of the data represents the number of vertices in the graph.
 Each vertex is a unique number between 0 and 9.
 The next element of the data represents the edges of the graph.
 Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v].
 Note that an edge [u,v] is the same as an edge [v,u], as order does not matter.
 You must construct a 2-coloring of the graph,
 meaning that you have to assign each vertex in the graph a "color",
 either 0 or 1, such that no two adjacent vertices have the same color.
 Submit your answer in the form of an array,
 where element 'i' represents the color of vertex i.
 If it is impossible to construct a 2-coloring of the given graph,
 instead submit an empty array.

 Examples:

 Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
 Output: [0, 0, 1, 1]

 Input: [3, [[0, 1], [0, 2], [1, 2]]]
 Output: []
   */
  const numVertices: number = <number>input[0];
  const unsortedEdges: number[][] = <number[][]>input[1];
  const edges: number[][] = unsortedEdges.sort(comparePairs);
  const vertices: number[] = arrayUnique(edges.flat()).sort();

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