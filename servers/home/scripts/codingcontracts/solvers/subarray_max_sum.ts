/**
 * @param {NS} _ns
 * @param {number[]} input
 */
export function subarrayMaxSum(_ns: NS, input: number[]): number {
  let maxSum = 0;

  for (let i = 0; i < input.length; i++) {

    let curSum = input[i];
    if (maxSum < curSum) {
      maxSum = curSum
    }

    for (let j = i + 1; j < input.length; j++) {
      curSum += input[j];

      if (maxSum < curSum) {
        maxSum = curSum
      }
    }
  }

  return  maxSum;
}
