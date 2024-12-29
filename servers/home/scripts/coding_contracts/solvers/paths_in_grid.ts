import {ZeroOrOne} from "@/servers/home/scripts/lib/enum_and_limiter_definitions";
import {newMultidimensionalArray} from "@/servers/home/scripts/lib/array_util";

// FIXME This works, but it locks up Firefox's JS runtime due to the recursion...
//  Possible approach: multidimensional array, start in bottom right,
//  set each cell to be the path & distance from there to the end.
//  That way, we only compute each possible path ONCE...
export function shortestPath(input: ZeroOrOne[][]) {
  /* Sample description
  Contract type: Shortest Path in a Grid
Contract description:
You are located in the top-left corner of the following grid:

   [[0,0,0,0,0,1,1],
   [0,0,0,0,1,1,0],
   [1,0,1,0,0,1,0],
   [0,0,0,0,0,0,0],
   [0,0,1,0,0,0,0],
   [0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0],
   [1,0,0,1,0,0,0]]

 You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

 Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path

 NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer should be an empty string.
 NOTE: The data returned for this contract is an 2D array of numbers representing the grid.

 Examples:

     [[0,1,0,0,0],
      [0,0,0,1,0]]

 Answer: 'DRRURRD'

     [[0,1],
      [1,0]]

 Answer: ''
   */

  /*
  When solving manually, favoring right, then down
  I look to see if the path is blocked, e.g. cells with '1' adjacent from one edge to another.
  Simpler to just recursively try all possible paths
  Use a 'visited' table - passed by value, or it'll become... messy - to prevent loops
   */

  const visited: boolean[][] = newMultidimensionalArray(input.length, input[0].length, false)

  // Calculate the 'no path' upper bound
  const invalidPathLength = input.length * input[0].length;

  const result = findPath(input, visited, 0, 0, invalidPathLength);

  if (result[1] >= invalidPathLength) {
    return '';
  }

  return result[0];
}

function findPath(grid: ZeroOrOne[][], visited: boolean[][], row: number, col: number, invalidPathLength: number): [string, number] {
  // Re-use some of the logic from countBranches
  // However, this time, we are concatenating the path, based on which branch has a shorter distance

  // We're in the destination
  if (row === grid.length - 1 && col === grid[0].length - 1) {
    return ['', 0];
  }

  // Check the row for out-of-bounds
  if (row < 0 || row > grid.length - 1) {
    return ['', invalidPathLength];
  }

  // Check the column for out-of-bounds
  if (col < 0 || col > grid[0].length - 1) {
    return ['', invalidPathLength];
  }

  // Check if this position was already visited, e.g. we're looping
  if (visited[row][col]) {
    return ['', invalidPathLength];
  }

  // Check if this position is blocked
  if (grid[row][col] === 1) {
    return ['', invalidPathLength];
  }

  // Yes, this can result in a lot of objects being created and discarded
  // However, if we DON'T do this, e.g. if we just use `slice`, the nested arrays are passed by ref,
  //  so different paths confuse each other's status
  const newVisited = newMultidimensionalArray(visited.length, visited[0].length, false)
  for (let i = 0; i < visited.length; i++) {
    for (let j = 0; j < visited[i].length; j++) {
      newVisited[i][j] = visited[i][j];
    }
  }
  newVisited[row][col] = true;

  // MEMO Tried writing a version that was iterable using `map` and `reduce`; it wasn't any cleaner to read
  // Get the path and path length for each direction; the recursive call handles the bounds checks
  const subPaths: Record<'U' | 'D' | 'L' | 'R', [string, number]> = {
    U: findPath(grid, newVisited, row - 1, col, invalidPathLength),
    D: findPath(grid, newVisited, row + 1, col, invalidPathLength),
    L: findPath(grid, newVisited, row, col - 1, invalidPathLength),
    R: findPath(grid, newVisited, row, col + 1, invalidPathLength)
  }

  let shortestPath: [string, number] = ['', invalidPathLength];
  let direction: string = '';
  for (const path in subPaths) {
    if (subPaths[path][1] < shortestPath[1]) {
      shortestPath = subPaths[path];
      direction = path;
    }
  }

  if (shortestPath[1] === invalidPathLength) {
    return shortestPath;
  }

  return [direction + shortestPath[0], shortestPath[1] + 1]
}


export function uniquePaths1(input: [number, number]): number {
  /* Sample description:
  You are in a grid with 14 rows and 7 columns,
  and you are positioned in the top-left corner of that grid.
  You are trying to reach the bottom-right corner of the grid,
  but you can only move down or right on each step.
  Determine how many unique paths there are from start to finish.

 NOTE: The data returned for this contract is an array
 with the number of rows and columns:

 [14, 7]
   */

  // REFINE I COULD solve this with a formula, but I just wrote the solver below, so...
  // Build a grid of zeroes
  return uniquePaths2(newMultidimensionalArray<ZeroOrOne>(input[0], input[1], 0));
}

export function uniquePaths2(input: ZeroOrOne[][]): number {
  /* Sample description
  You are located in the top-left corner of the following grid:

 0,0,0,0,0,0,0,0,0,1,1,
0,0,0,0,0,0,0,0,0,0,0,

 You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

 Determine how many unique paths there are from start to finish.

 NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
   */

  /*
  Start with 1 possible path
  Add 1 any time we can branch
  If a path ends, remove that branch (subtract 1)
   */

  return 1 + countBranches(input, 0, 0);
}

function countBranches(grid: ZeroOrOne[][], row: number, column: number) {

  // Bound for the edges
  // We're at the end; only 'blocked' case that doesn't subtract a branch
  if (row === grid.length - 1 && column === grid[row].length - 1) {
    return 0;
  }

  // Blocked to the bottom; check if we can go right
  if (row === grid.length - 1 || grid[row + 1][column] === 1) {
    if (grid[row][column + 1] === 0) {
      return countBranches(grid, row, column + 1);
    } else {
      return -1;
    }
  }

  // Blocked to the right; check if we can go down
  if (column === grid[row].length - 1 || grid[row][column + 1] === 1) {
    if (grid[row + 1][column] === 0) {
      return countBranches(grid, row + 1, column);
    } else {
      return -1;
    }
  }

  return 1 + countBranches(grid, row, column + 1) + countBranches(grid, row + 1, column);


}