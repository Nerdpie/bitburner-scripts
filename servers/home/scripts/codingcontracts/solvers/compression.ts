/**
 * Compression I: RLE Compression
 * @param {NS} ns
 * @param {string} input
 */
export function compression1(ns: NS, input: string): string {
  if (!input || input.length === 0) {
    throw new Error('Invalid input for RLE Compression');
  }

  // Get the first character
  // Count how many in a row
  // If >9, subtract 9 and repeat

  let processing: string = input;
  let result: string = '';

  let char: string;
  let count: number;

  do {
    char = processing.charAt(0);
    count = 0;
    while (count < processing.length && processing.charAt(count) === char) {
      count++
    }

    if (processing.length === count) {
      // We counted to the end of the string
      processing = undefined;
    } else {
      // Remove the characters we just counted
      processing = processing.substring(count)
    }

    // RLE can have run lengths of at most 9
    while (count > 9) {
      result += 9 + char;
      count -= 9
    }
    result += count + char;

  } while (processing)

  return result;
}

/**
 * Compression II: LZ Decompression
 * @param {NS} ns
 * @param {string} input
 */
export function compression2(ns: NS, input: string): void {

}

/**
 * Compression III: LZ Compression
 * @param {NS} ns
 * @param {string} input
 */
export function compression3(ns: NS, input: string): void {

}