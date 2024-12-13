// TODO Write the path solvers
export function shortestPath(input: number[], ns: NS) {


  /*
  When solving manually, favoring right, then down
  I look to see if the path is blocked, e.g. cells with '1' adjacent from one edge to another.
  Simpler to just recursively try all possible paths
  Use a 'visited' table - passed by value, or it'll become... messy - to prevent loops
   */
}


export function uniquePaths1(input: [number, number], ns: NS) {
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
  const grid = [13, 7];
  const maxMoveRight = grid[0] - 1;
  const maxMoveDown = grid[1] - 1;

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
}

export function uniquePaths2(input: number[][], ns: NS) {
  /* Sample description
  You are located in the top-left corner of the following grid:

 0,0,0,0,0,0,0,0,0,1,1,
0,0,0,0,0,0,0,0,0,0,0,

 You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

 Determine how many unique paths there are from start to finish.

 NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
   */
}