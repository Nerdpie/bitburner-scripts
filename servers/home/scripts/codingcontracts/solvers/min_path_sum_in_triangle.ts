export function minPathSumInTriangle(_ns: NS, input: number[][]): number {

  function innerPathSum(input: number[][], position: number): number {
    if (input.length === 1) {
      return input[0][position];
    }
    const currentRow = input[0][position];
    const remainder = input.slice(1);
    return currentRow + Math.min(innerPathSum(remainder, position), innerPathSum(remainder, position + 1));
  }

  return (innerPathSum(input, 0));
}