function spiralRight(matrix: number[][], result: number[]): void {
  if (!matrix || matrix.length === 0) {
    return;
  }

  matrix[0]?.forEach(n => result.push(n));

  spiralDown(matrix.slice(1), result);
}

function spiralDown(matrix: number[][], result: number[]): void {
  if (!matrix || matrix.length === 0) {
    return;
  }
  for (let i = 0; i < matrix.length; i++) {
    const temp = matrix[i].pop();
    if (temp) {
      result.push(temp);
    }
  }
  spiralLeft(matrix, result);
}

function spiralLeft(matrix: number[][], result: number[]): void {
  if (!matrix || matrix.length === 0) {
    return;
  }

  matrix.pop()?.reverse().forEach(n => result.push(n));

  spiralUp(matrix, result);
}

function spiralUp(matrix: number[][], result: number[]): void {
  if (!matrix || matrix.length === 0) {
    return;
  }

  for (let i = matrix.length - 1; i >= 0; i--) {
    const temp = matrix[i].shift();
    if (temp) {
      result.push(temp);
    }
  }

  spiralRight(matrix, result);
}

/**
 * @param {number[][]} input
 */
export function spiralizeMatrix(input: number[][]): number[] {
  if (input.length === 0 || input[0].length === 0) {
    return [];
  }

  const result: number[] = [];
  spiralRight(input, result);

  return result;
}
