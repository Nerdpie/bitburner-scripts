export async function main(ns: NS): Promise<void>  {
  // noinspection JSUnusedLocalSymbols - Give me a minute...
  const types = [
    "Find Largest Prime Factor",
    "Subarray with Maximum Sum",
    "Total Ways to Sum",
    "Total Ways to Sum II",
    "Spiralize Matrix",
    "Array Jumping Game",
    "Array Jumping Game II",
    "Merge Overlapping Intervals",
    "Generate IP Addresses",
    "Algorithmic Stock Trader I",
    "Algorithmic Stock Trader II",
    "Algorithmic Stock Trader III",
    "Algorithmic Stock Trader IV",
    "Minimum Path Sum in a Triangle",
    "Unique Paths in a Grid I",
    "Unique Paths in a Grid II",
    "Shortest Path in a Grid",
    "Sanitize Parentheses in Expression",
    "Find All Valid Math Expressions",
    "HammingCodes: Integer to Encoded Binary",
    "HammingCodes: Encoded Binary to Integer",
    "Proper 2-Coloring of a Graph",
    "Compression I: RLE Compression",
    "Compression II: LZ Decompression",
    "Compression III: LZ Compression",
    "Encryption I: Caesar Cipher",
    "Encryption II: Vigenère Cipher"
  ]

  // TODO Map the contract types to file names
  /*
  Could use file path to determine if it's finished or not,
  but then we would need to pass data to a separate script,
  probably using the ports...
   */

  /*
  This script will replace parts of `scan_contracts.ts` and `contract_calc.ts`
  It will iterate over the set of servers, checking for contracts
  It will then see if we have a finished solver written for each
  If yes, it will automatically solve them
  If it fails, it will stop after the first attempt and log such
  If we do not have a solver finished, it will record the contract name and server in a file

  The replacement for `contract_calc.ts` will check what server the player is on.
  If there are contracts found on that server, it will then prompt which one, if multiple are present.
  It will then execute the WiP solver, if present, displaying the data
   */
}