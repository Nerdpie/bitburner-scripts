/**
 * Compression I: RLE Compression
 * @param {string} input
 */
export function compression1(input: string): string {
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

// noinspection SpellCheckingInspection - Spellcheck doesn't like the arbitrary text in the examples
/**
 * Compression II: LZ Decompression
 * @param {string} input
 */
export function compression2(input: string): string {
  /* Sample description:
  Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

 1. Exactly L characters, which are to be copied directly into the uncompressed data.
 2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

 For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

 You are given the following LZ-encoded string:
     7wDDx6Xo275fpAWQ184m6un991y659W0LQPVh4O064JuDev274xQGi929Oon8fF37807C1LH2Ay657IyPLc2k
 Decode it and output the original string.

 Example: decoding '5aaabb450723abb' chunk-by-chunk

     5aaabb           ->  aaabb
     5aaabb45         ->  aaabbaaab
     5aaabb450        ->  aaabbaaab
     5aaabb45072      ->  aaabbaaababababa
     5aaabb450723abb  ->  aaabbaaababababaabb
   */

  let result = '';
  let index = 0;
  while (index < input.length) {
    const length1 = parseInt(input[index]);
    index++;
    if (length1 > 0) {
      result += input.slice(index, index + length1);
      index += length1;
    }

    let length2 = parseInt(input[index]);
    index++;
    if (length2 > 0) {
      let copyFrom = result.length - parseInt(input[index]);
      index++;

      do {
        result += result[copyFrom];
        length2--;
        copyFrom++;
      }
      while (length2 > 0)
    }
  }

  return result
}

// noinspection SpellCheckingInspection
/**
 * Compression III: LZ Compression
 * @param {string} input
 * @param {NS} ns
 */
export function compression3(input: string, ns: NS): void {
  /* Sample description:
  Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

 1. Exactly L characters, which are to be copied directly into the uncompressed data.
 2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

 For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

 You are given the following input string:
     JpRWdFmJpRW4BM8j8W4N2PzkYvk7A4A4A4AbA4A4AbAY4A4AbAal2al2d0nl2al2ddddd
 Encode it using Lempel-Ziv encoding with the minimum possible output length.

 Examples (some have other possible encodings of minimal length):
     abracadabra     ->  7abracad47
     mississippi     ->  4miss433ppi
     aAAaAAaAaAA     ->  3aAA53035
     2718281828      ->  627182844
     abcdefghijk     ->  9abcdefghi02jk
     aaaaaaaaaaaa    ->  3aaa91
     aaaaaaaaaaaaa   ->  1a91031
     aaaaaaaaaaaaaa  ->  1a91041
   */
}