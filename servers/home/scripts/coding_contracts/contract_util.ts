/* eslint-disable @typescript-eslint/no-explicit-any */
import {arrayJumpingGame, arrayJumpingGame2}                                from './solvers/array_jumping_game';
import {encryption1, encryption2}                                           from './solvers/ciphers';
import {compression1, compression2, compression3}                           from './solvers/compression';
import {decodeHammingBinary, encodeIntegerHamming}                          from './solvers/hamming_codes';
import {mergeOverlappingPairs}                                              from './solvers/merge_overlapping_pairs';
import {minPathSumInTriangle}                                               from './solvers/min_path_sum_in_triangle';
import {bigIntSquareRoot, largestPrimeFactor}                               from './solvers/number_logic';
import {shortestPath, uniquePaths1, uniquePaths2}                           from './solvers/paths_in_grid';
import {sanitizeParens}                                                     from './solvers/sanitize_parens';
import {spiralizeMatrix}                                                    from './solvers/spiralize_matrix';
import {algoStockTrade1, algoStockTrade2, algoStockTrade3, algoStockTrade4} from './solvers/stock_traders';
import {subarrayMaxSum}                                                     from './solvers/subarray_max_sum';
import {twoColorGraph}                                                      from './solvers/two_color_graph';
import {findValidMathExpression, generateIPAddresses}                       from './solvers/valid_expressions';
import {waysToSum1, waysToSum2}                                             from './solvers/ways_to_sum';

export enum CodingContractTypes {
  // noinspection JSNonASCIINames - These MUST match the names from in-game
  'Find Largest Prime Factor' = 'Find Largest Prime Factor',
  'Subarray with Maximum Sum' = 'Subarray with Maximum Sum',
  'Total Ways to Sum' = 'Total Ways to Sum',
  'Total Ways to Sum II' = 'Total Ways to Sum II',
  'Spiralize Matrix' = 'Spiralize Matrix',
  'Array Jumping Game' = 'Array Jumping Game',
  'Array Jumping Game II' = 'Array Jumping Game II',
  'Merge Overlapping Intervals' = 'Merge Overlapping Intervals',
  'Generate IP Addresses' = 'Generate IP Addresses',
  'Algorithmic Stock Trader I' = 'Algorithmic Stock Trader I',
  'Algorithmic Stock Trader II' = 'Algorithmic Stock Trader II',
  'Algorithmic Stock Trader III' = 'Algorithmic Stock Trader III',
  'Algorithmic Stock Trader IV' = 'Algorithmic Stock Trader IV',
  'Minimum Path Sum in a Triangle' = 'Minimum Path Sum in a Triangle',
  'Unique Paths in a Grid I' = 'Unique Paths in a Grid I',
  'Unique Paths in a Grid II' = 'Unique Paths in a Grid II',
  'Shortest Path in a Grid' = 'Shortest Path in a Grid',
  'Sanitize Parentheses in Expression' = 'Sanitize Parentheses in Expression',
  'Find All Valid Math Expressions' = 'Find All Valid Math Expressions',
  'HammingCodes: Integer to Encoded Binary' = 'HammingCodes: Integer to Encoded Binary',
  'HammingCodes: Encoded Binary to Integer' = 'HammingCodes: Encoded Binary to Integer',
  'Proper 2-Coloring of a Graph' = 'Proper 2-Coloring of a Graph',
  'Compression I: RLE Compression' = 'Compression I: RLE Compression',
  'Compression II: LZ Decompression' = 'Compression II: LZ Decompression',
  'Compression III: LZ Compression' = 'Compression III: LZ Compression',
  'Encryption I: Caesar Cipher' = 'Encryption I: Caesar Cipher',
  'Encryption II: Vigenère Cipher' = 'Encryption II: Vigenère Cipher',
  'Square Root' = 'Square Root'
}

export interface SolverInfo {
  function: ((input: any, ns: NS) => any);
  finished: boolean;
}

// noinspection JSNonASCIINames - These MUST match the names from in-game
export const ContractSolvers: Record<CodingContractTypes, Required<SolverInfo>> = {
  'Algorithmic Stock Trader I': {
    function: algoStockTrade1,
    finished: true
  },
  'Algorithmic Stock Trader II': {
    function: algoStockTrade2,
    finished: true
  },
  'Algorithmic Stock Trader III': {
    function: algoStockTrade3,
    finished: false
  },
  'Algorithmic Stock Trader IV': {
    function: algoStockTrade4,
    finished: false
  },
  'Array Jumping Game II': {
    function: arrayJumpingGame2,
    finished: false
  },
  'Array Jumping Game': {
    function: arrayJumpingGame,
    finished: false
  },
  'Compression I: RLE Compression': {
    function: compression1,
    finished: true
  },
  'Compression II: LZ Decompression': {
    function: compression2,
    finished: true
  },
  'Compression III: LZ Compression': {
    function: compression3,
    finished: false
  },
  'Encryption I: Caesar Cipher': {
    function: encryption1,
    finished: true
  },
  'Encryption II: Vigenère Cipher': {
    function: encryption2,
    finished: true
  },
  'Find All Valid Math Expressions': {
    function: findValidMathExpression,
    finished: false
  },
  'Find Largest Prime Factor': {
    function: largestPrimeFactor,
    finished: true
  },
  'Generate IP Addresses': {
    function: generateIPAddresses,
    finished: false
  },
  'HammingCodes: Encoded Binary to Integer': {
    function: decodeHammingBinary,
    finished: false
  },
  'HammingCodes: Integer to Encoded Binary': {
    function: encodeIntegerHamming,
    finished: false
  },
  'Merge Overlapping Intervals': {
    function: mergeOverlappingPairs,
    finished: true
  },
  'Minimum Path Sum in a Triangle': {
    function: minPathSumInTriangle,
    finished: true
  },
  'Proper 2-Coloring of a Graph': {
    function: twoColorGraph,
    finished: true
  },
  'Sanitize Parentheses in Expression': {
    function: sanitizeParens,
    finished: true
  },
  'Shortest Path in a Grid': {
    function: shortestPath,
    finished: true
  },
  'Spiralize Matrix': {
    function: spiralizeMatrix,
    finished: true
  },
  'Square Root': {
    function: bigIntSquareRoot,
    finished: true
  },
  'Subarray with Maximum Sum': {
    function: subarrayMaxSum,
    finished: true
  },
  'Total Ways to Sum II': {
    function: waysToSum2,
    finished: false
  },
  'Total Ways to Sum': {
    function: waysToSum1,
    finished: false
  },
  'Unique Paths in a Grid I': {
    function: uniquePaths1,
    finished: true
  },
  'Unique Paths in a Grid II': {
    function: uniquePaths2,
    finished: true
  },
};

export class ContractWrapper {
  host: string;
  filename: string;
  type: string;
  description: string;
  data: any;
  solver: SolverInfo;

  constructor(ns: NS, host: string, filename: string) {
    this.host = host;
    this.filename = filename;

    this.type = ns.codingcontract.getContractType(filename, host);
    this.description = ns.codingcontract.getDescription(filename, host);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.data = ns.codingcontract.getData(filename, host);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.solver = ContractSolvers[this.type];
  }

  get #isSolverAsync(): boolean {
    return this.solver.function.constructor.name === 'AsyncFunction';
  }

  attemptsRemaining(ns: NS): number {
    return ns.codingcontract.getNumTriesRemaining(this.filename, this.host);
  }

  async attemptToSolve(ns: NS): Promise<string> {
    let solution: any;

    if (this.#isSolverAsync) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      solution = await this.solver.function(this.data, ns);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      solution = this.solver.function(this.data, ns);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return ns.codingcontract.attempt(solution, this.filename, this.host);
  }

  async getSolution(ns: NS): Promise<any> {
    if (this.#isSolverAsync) {
      return await this.solver.function(this.data, ns);
    }

    return this.solver.function(this.data, ns);
  }
}
