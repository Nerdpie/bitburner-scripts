// Copied from https://github.com/catloversg/bitburner-scripts/blob/main/src/libs/utils.ts
export function assertIsNumber(value: unknown, errorMessage = "Not a number"): asserts value is number {
  if (typeof value !== "number") {
    throw new Error(errorMessage);
  }
}

export function assertIsString(value: unknown, errorMessage = "Not a string"): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(errorMessage);
  }
}

export function removeItemFromArray<T>(array: T[], item: T) {
  array.forEach((value, index) => {
    if (value === item) {
      array.splice(index, 1);
    }
  });
}

/**
 * Return NaN if input is:
 * - undefined
 * - null
 * - empty string ("")
 * @param input
 */
export function parseNumber(input: number | string | null | undefined) {
  // Number(undefined) is NaN, so we don't have to handle that case
  if (input === null || input === "") {
    return NaN;
  }
  return Number(input);
}

export function mapToJson(map: Map<unknown, unknown>): string {
  return JSON.stringify(map, (_key, value) => (value instanceof Map ? [...value] : value));
}

export function downloadData(data: string, filename: string = Date.now().toString()) {
  const file = new Blob([data], {type: "text/plain"});
  const element = document.createElement("a");
  const url = URL.createObjectURL(file);
  element.href = url;
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  setTimeout(function () {
    document.body.removeChild(element);
    window.URL.revokeObjectURL(url);
  }, 0);
}

export function scaleValueToRange(value: number, currentMin: number, currentMax: number, newMin: number, newMax: number): number {
  return ((value - currentMin) * (newMax - newMin) / (currentMax - currentMin)) + newMin;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((sum, value) => sum + value, 0);
}

export function mean(numbers: number[]) {
  return sum(numbers) / numbers.length;
}

export function median(numbers: number[]) {
  const sorted = numbers.toSorted();
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

//-------------------------------------------------- Random functions --------------------------------------------------
// Ref 1: https://dimitri.xyz/random-ints-from-random-bits/
// Ref 2: https://github.com/nodejs/node/blob/main/lib/internal/crypto/random.js

/**
 * @param {Number} range
 * @returns {Number} Returned value is in interval [0, range)
 */
export function getRandomIntegerLessThan(range: number): number {
  // 32 bit maximum
  const maxRange = 4294967296;  // 2^32
  /* extended range rejection sampling */
  const randLimit = maxRange - (maxRange % range);
  let sample;
  let count = 0;
  const maxIter = 100;
  do {
    sample = self.crypto.getRandomValues(new Uint32Array(1))[0];
    if (count >= maxIter) {
      throw new Error("Too many iterations. Check your source of randomness.");
    }
    count++;
  } while (sample >= randLimit);
  return sample % range;
}

/**
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} Returned value is in interval [low, high)
 */
export function getRandomInteger(min: number, max: number): number {
  if (min > max) {
    throw new Error(`Min is larger than max. Min: ${min}. Max: ${max}.`);
  }
  if (min === 0 && max === 0) {
    throw new Error(`Invalid range. Min and max must not be both 0.`);
  }
  return (min + getRandomIntegerLessThan(max - min));
}

//-------------------------------------------------- Random functions --------------------------------------------------