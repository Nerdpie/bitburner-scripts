// TODO Write the path solvers
export function shortestPath(ns: NS, input: number[]) {
  let grid = [13, 7];
  let maxMoveRight = grid[0] - 1;
  let maxMoveDown = grid[1] - 1;

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

export function uniquePaths1(ns: NS, input: number[][]) {

}

export function uniquePaths2(ns: NS, input: number[][]) {

}