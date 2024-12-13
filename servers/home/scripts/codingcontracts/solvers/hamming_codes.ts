// noinspection GrazieInspection - TODO File a bug report; 'least significant bits' doesn't need a preceding `the`
// TODO Write the Hamming code solvers
export function decodeHammingBinary(ns: NS, input ) {
  /* Sample description:
  You are given the following encoded binary string:
 '0110010010010000'

 Decode it as an 'extended Hamming code' and convert it to a decimal value.
 The binary string may include leading zeroes.
 A parity bit is inserted at position 0 and at every position N where N is a power of 2.
 Parity bits are used to make the total number of '1' bits in a given set of data even.
 The parity bit at position 0 considers all bits including parity bits.
 Each parity bit at position 2^N alternately considers 2^N bits then ignores 2^N bits, starting at position 2^N.
 The endianness of the parity bits is reversed compared to the endianness of the data bits:
 Data bits are encoded most significant bit first and the parity bits encoded least significant bit first.
 The parity bit at position 0 is set last.
 There is a ~55% chance for an altered bit at a random index.
 Find the possible altered bit, fix it and extract the decimal value.

 Examples:

 '11110000' passes the parity checks and has data bits of 1000, which is 8 in binary.
 '1001101010' fails the parity checks and needs the last bit to be corrected to get '1001101011',
 after which the data bits are found to be 10101, which is 21 in binary.

 For more information on the 'rule' of encoding, refer to Wikipedia (https://wikipedia.org/wiki/Hamming_code)
 or the 3Blue1Brown videos on Hamming Codes. (https://youtube.com/watch?v=X8jsijhllIA)
   */
}

export function encodeIntegerHamming(ns: NS, input: number) {

}