// TODO Write the path solvers
import {OneOrZero} from "@/servers/home/scripts/lib/limiter_definitions";

export function shortestPath(input: OneOrZero[][], ns: NS) {
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
}

function findPath(grid: OneOrZero[][], visited: boolean[][], row: number, col: number) {
  // Re-use some of the logic from countBranches
  // However, this time, we are concatenating the path, based on which branch has a shorter distance


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


  /* Possibilities:
   * maxMoveRight, down
   * maxMoveRight - 1, down (1 to maxMoveDown), right,
   *
   *
   * Recursive algorithm?  Break into subsections.
   *
   * 2x2 grid = 2 options => right, down; down, right
   * 2x1 grid = 1 option => right
   * 1x2 grid = 1 option => down
   */


  // REFINE I COULD solve this with a formula, but I just wrote the solver below, so...
  // Build a grid of zeroes
  const row: number[] = Array(input[1]).fill(0);
  const grid: number[][] = Array<number[]>(input[0]).fill(row);
  return uniquePaths2(<OneOrZero[][]>grid);
}

export function uniquePaths2(input: OneOrZero[][]): number {
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

function countBranches(grid: OneOrZero[][], row: number, column: number) {

  // Bound for the edges
  // We're at the end; only 'blocked' case that doesn't subtract a branch
  if (row === grid.length - 1 && column === grid[row].length - 1) {
    return 0;
  }

  // Blocked to the bottom; check if we can go right
  if (row=== grid.length - 1 || grid[row+1][column] === 1) {
    if ( grid[row][column+1] === 0 ) {
      return countBranches(grid, row, column + 1);
    } else {
      return -1;
    }
  }

  // Blocked to the right; check if we can go down
  if (column === grid[row].length - 1 || grid[row][column + 1] === 1) {
    if ( grid[row + 1][column] === 0 ) {
      return countBranches(grid, row+1, column);
    } else {
      return -1;
    }
  }

  return 1 + countBranches(grid, row, column + 1) + countBranches(grid, row + 1, column);


}