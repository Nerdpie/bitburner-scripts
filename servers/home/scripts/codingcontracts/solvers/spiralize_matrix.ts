function spiralRight(ns: NS, matrix: number[][], result: number[]): void {
  if (!matrix || matrix.length === 0) {
    return
  }

  matrix[0]?.forEach(n => result.push(n))

  spiralDown(ns, matrix.slice(1), result)
}

function spiralDown(ns: NS, matrix: number[][], result: number[]): void {
  if (!matrix || matrix.length === 0) {
    return;
  }
  for (let i = 0; i < matrix.length; i++) {
    const temp = matrix[i].pop();
    if (temp) {
      result.push(temp);
    }
  }
  spiralLeft(ns, matrix, result);
}

function spiralLeft(ns: NS, matrix: number[][], result: number[]): void {
  if (!matrix || matrix.length === 0) {
    return
  }

  matrix.pop()?.reverse().forEach(n => result.push(n));

  spiralUp(ns, matrix, result);
}

function spiralUp(ns: NS, matrix: number[][], result: number[]): void {
  if (!matrix || matrix.length === 0) {
    return
  }

  for (let i = matrix.length - 1; i >= 0; i--) {
    const temp = matrix[i].shift();
    if (temp) {
      result.push(temp);
    }
  }

  spiralRight(ns, matrix, result)
}

/**
 * @param {NS} ns
 * @param {number[][]} input
 */
export function spiralizeMatrix(ns: NS, input: number[][]): void {
  if (input.length === 0 || input[0].length === 0) {
    ns.print('[]')
    return
  }

  //ns.print(input)

  const result: number[] = [];
  spiralRight(ns, input, result)

  ns.print(result)
}
