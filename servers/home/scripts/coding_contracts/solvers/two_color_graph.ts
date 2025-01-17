// 2-coloring of a graph
import {arrayUnique}  from "@lib/array_util";
import {comparePairs} from "@lib/comparators";

class Vertex {
  id: number;
  neighbors: Set<Vertex>;
  #color: -1 | 0 | 1;

  constructor(id: number) {
    this.id = id;
    this.#color = -1;
    this.neighbors = new Set<Vertex>();
  }

  get color() {
    return this.#color;
  }

  setColor(c: 0 | 1) {
    if (this.#color !== -1 && this.#color !== c) {
      throw new Error("Could not set a conflicting color!");
    }

    this.#color = c;
  }

  colorNeighbors() {
    const neighborColor = this.#color === 0 ? 1 : 0;
    this.neighbors.forEach(v => {
      const origColor = v.color;
      v.setColor(neighborColor);

      // Avoid looping
      if (origColor === -1) {
        v.colorNeighbors();
      }
    });
  }
}

export function twoColorGraph(input: [number, [[number, number]]]): (number | null)[] {
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
  const numVertices: number = input[0];
  const unsortedEdges: [[number, number]] = input[1];
  const edges: [[number, number]] = unsortedEdges.sort(comparePairs);

  // Yes, this could be done with a set of multi-dim arrays to track the neighbors
  // The classes help me follow the flow more easily, and add in safeties
  const vertices = new Map<number, Vertex>();
  arrayUnique(edges.flat()).sort().forEach(v => {
    vertices.set(v, new Vertex(v));
  });

  // Populate the list of neighbors
  edges.forEach(edge => {
    const vertA = vertices.get(edge[0]);
    const vertB = vertices.get(edge[1]);
    if (vertA === undefined) {
      throw new Error("vertA is undefined");
    }
    if (vertB === undefined) {
      throw new Error("vertB is undefined");
    }
    vertA.neighbors.add(vertB);
    vertB.neighbors.add(vertA);
  });

  // Our result will need to have a space for each POSSIBLE vertex
  const result: (number | null)[] = Array<number | null>(numVertices).fill(null);

  // REFINE Adjust this to NOT rely on exceptions for code flow...
  try {
    // The map APPEARS to be sorted on the keys/insert order (same in our case), so...
    // This also handles the case where vertices aren't all in a single graph
    vertices.forEach((v) => {
      if (v.color === -1) {
        v.setColor(0);
        v.colorNeighbors();
      }
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Two Color Graph error: ${error}`);
    return [];
  }

  vertices.forEach((v) => {
    result[v.id] = v.color;
  });

  return result;
}
