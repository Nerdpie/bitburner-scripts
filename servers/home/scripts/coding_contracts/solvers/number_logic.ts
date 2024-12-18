// TODO Write the prime factor and square root solvers
// noinspection MagicNumberJS - Inspection doesn't properly handle bigint values

export function largestPrimeFactor(input: number, ns: NS): number {
  // Deriving from old prime factorization homework

  let temp = input;
  let largestFactor = 1;

  for (let p = 2; p < Math.sqrt(input); p++) {
    if (temp % p === 0) {
      largestFactor = p;
      ns.print(p);
      do {
        temp /= p;
      } while ( temp % p === 0);
    }
  }

  // Any remainder
  if (temp > 1) {
    ns.print(temp)
    largestFactor = temp;
  }

  return largestFactor;
}

export function bigIntSquareRoot(input: bigint, ns: NS) {
  /* Sample description:
  You are given a ~200 digit BigInt. Find the square root of this number, to the nearest integer.
Hint: If you are having trouble, you might consult https://en.wikipedia.org/wiki/Methods_of_computing_square_roots

Input number:
155749932796205787079025839946442092616646565216212968193628150507722784379219739882976855229303236383313179875170603194170831690566247341307989070313945888007061855549721919178598301718356612610671431
   */

  // Nope, not that easy, since 0.5 isn't an integer... d'oh
  //ns.print(input ** BigInt(0.5));

  // Having glanced at the Wikipedia article, a very naive approach comes to mind
  /*
  As numbers get larger, the relative gap between them and their root widens
  For example, 2^2 = 4, with a ratio of 1:2 ; 4^2 = 16, with a ratio of 1:4

  Trying a binary search
  input
  upper = input
  lower = 1n

  while


   */

  // Yes, this could be inlined, but I was testing different algorithms, and it seems to work, so...
  return squareRootHeronsMethod(input);
}

function squareRootHeronsMethod(input: bigint): bigint {
  const maxPasses = 400;
  let passes = 0;
  let x = 1n;

  // This SHOULD provide us with bounds if the root would be a decimal value
  while (!( x ** 2n <= input && (x + 1n) ** 2n > input)) {
    x = (x + (input / x)) / 2n;
    if (passes > maxPasses) {
      return -1n;
    }
    passes++;
  }

  // If it isn't a perfect square, check which value is closer
  if (absoluteValue(input - (x ** 2n)) > absoluteValue(input - ((x + 1n) ** 2n))){
    x += 1n;
  }

  return x;
}

function absoluteValue(n: bigint): bigint {
  if (n > 0n) {return n}

  return 0n - n;
}