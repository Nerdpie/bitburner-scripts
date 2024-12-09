import { exposeGameInternalObjects } from "servers/home/scripts/lib/exploits"
import { ScriptSettings } from "servers/home/scripts/settings"

/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  ns.clearLog();

  let config = ScriptSettings.contract_calc;
  ns.moveTail(config.x, config.y);
  ns.resizeTail(config.width, config.height);

  //exposeGameInternalObjects();


  let input =
        [96,45,30,147,154,34,93,72,31,33,158,2,130,195,16,118,126,147,196,95,182,21,26,52,192,6,103,191,166,182,88,186]

  //subarrayMaxSum(ns, input);
  //mergeOverlappingPairs(ns, input);
  algoStockTrade2(ns, input);
  //algoStockTrade3(ns, input);
  //algoStockTrade4(ns, input);
  //twoColorGraph(ns, input);
  //spiralizeMatrix(ns, input)
  //compression1(ns, input);
  //sanitizeParens(ns, input);
  //arrayJumpingGame(ns, input);
}

// TODO Move these to a lib file for comparators
/** 
 * Helper to sort pairs of numbers
 * @param {number[]} a
 * @param {number[]} b
 * @return {number} Negative if `a` is less than `b`, 0 if equal, and positive if `b` is less than `a`
 */
function comparePairs(a, b) {
  if (a[0] == b[0]) {
    return a[1] - b[1]
  } else {
    return a[0] - b[0]
  }
}

/**
 * Helper to compare pairs of numbers
 * @param {number} a
 * @param {number} b
 * @return {number} Negative if `a` is less than `b`, 0 if equal, and positive if `b` is less than `a`
 */
function compareNumbers(a, b) {
  return a - b;
}

//TODO Just alter the prototype to have this by default...
/**
 * Get the unique values in an array
 * @param {Array} arr
 * @return {Array} Unique values from the input array
 * @link https://stackoverflow.com/q/1960473 - Reference
 */
function arrayUnique(arr) {
  return [...new Set(arr)];
}

/**
 * @param {NS} ns
 * @param {number[]} input
 */
function subarrayMaxSum(ns, input) {
  let maxSum = 0;

  for (let i = 0; i < input.length; i++) {

    let curSum = input[i];
    if (maxSum < curSum) { maxSum = curSum };

    for (let j = i + 1; j < input.length; j++) {
      curSum += input[j];

      if (maxSum < curSum) { maxSum = curSum };
    }
  };

  ns.printf("Max sum: %d", maxSum);
}

/** 
 * @param {NS} ns
 * @param {number[][]} input
 */
function sortIntervals(ns, input) {
  ns.print(input.sort(comparePairs));
}

/**
 * @param {NS} ns
 * @param {number[][]} input
 */
function mergeOverlappingPairs(ns, input) {
  // Sorted in reverse because we will be using `pop`
  let sorted = input.sort(comparePairs).reverse();
  let merged = [];

  let temp = sorted.pop();
  let lower = temp[0];
  let upper = temp[1];


  // I'm sure there's a better algorithm; I'm just going off my manual process
  while (temp) {
    /* ns.print('temp: ' + temp)
    ns.print('lower: ' + lower)
    ns.print('upper: ' + upper)
    ns.print('sorted: ' + sorted)
    ns.print('merged: ' + merged) */

    // Only checking one 'edge' since it's already sorted
    if (lower <= temp[0] && temp[0] <= upper) {
      upper = Math.max(upper, temp[1])
    } else {
      merged.push([lower, upper]);
      lower = temp[0];
      upper = temp[1];
    }

    // Get the next element to check
    temp = sorted.pop();
  }
  /* ns.print('temp: ' + temp)
  ns.print('lower: ' + lower)
  ns.print('upper: ' + upper)
  ns.print('sorted: ' + sorted)
  ns.print('merged: ' + merged) */

  // Add in our final pair
  merged.push([lower, upper]);

  ns.print(merged)

}

/**
 * @param {NS} ns
 */
function overAndDown(ns) {
  let grid = [13, 7];
  let maxMoveRight = grid[0] - 1;
  let maxMoveDown = grid[1] - 1;

  /* Possibilities:
   * maxMoveRight, down
   * maxMoveRight - 1, down (1 to maxMoveDown), right,
   * 
   * 
   * Recursive algorithm?  Break into subsections.
   * 
   * 2x2 grid = 2 options => right, down; down, right
   * 2x1 grid = 1 option => right
   * 1x2 grid = 1 option => down
   */
}

// algoStockTrade1 - nested loop, find the greatest difference

// algoStockTrade2 - sum all increases in value
/** 
 * @param {NS} ns
 * @param {number[]} values
 */
function algoStockTrade2(ns, values) {

  // Using `reduce` isn't any more concise...
  let sum = 0;

  for (let i = 1; i < values.length; i++) {
    sum += Math.max(0, values[i] - values[i - 1]);
  }

  ns.printf('Max profit: %d', sum);

}

class StockTrade {
  constructor(buyValue, buyIndex, sellValue, sellIndex) {
    this.buyValue = buyValue;
    this.buyIndex = buyIndex;
    this.sellValue = sellValue;
    this.sellIndex = sellIndex;
  }
  buyValue = 0;
  buyIndex = 0;
  sellValue = 0;
  sellIndex = 0;
  profit() { return this.sellValue - this.buyValue }
  toString() { return "[" + this.buyIndex + "," + this.buyValue + "] => [" + this.sellIndex + "," + this.sellValue + "] = " + this.profit() }
}

/**
 * @param {NS} ns
 * @param {number[]} input
 */
function algoStockTrade3(ns, input) {
  algoStockTrade4(ns, [2, input]);
}

/** 
 * @param {NS} ns 
 * @param {Array} input
 */
function algoStockTrade4(ns, input) {
  let numTrades = input[0];
  let prices = input[1];
  let numPrices = prices.length;


  // Trim out any entries that will not be picked
  // If we have [1, 2, 3], we won't buy or sell at 2
  for (let i = 0; i + 2 < numPrices; i++) {
    while (i + 2 < numPrices && prices[i] <= prices[i + 1] && prices[i + 1] <= prices[i + 2]) {
      prices.splice(i + 1, 1);
      numPrices = prices.length;
    }
  }

  // Same for decreasing values
  for (let i = 0; i + 2 < numPrices; i++) {
    while (i + 2 < numPrices && prices[i] >= prices[i + 1] && prices[i + 1] >= prices[i + 2]) {
      prices.splice(i + 1, 1);
      numPrices = prices.length;
    }
  }

  // Remove leading high prices
  while (numPrices > 1 && prices[0] >= prices[1]) {
    prices.splice(0, 1);
    numPrices = prices.length;
  }

  // Remove trailing low prices
  while (numPrices > 1 && prices[numPrices - 1] <= prices[numPrices - 2]) {
    prices.pop();
    numPrices = prices.length;
  }

  if (numPrices <= 1) {
    ns.print('All lose money');
    return;
  }

  //ns.print(prices);

  /** @type {StockTrade[]} */
  let trades = [];

  // Find each pair of POSSIBLE transactions
  prices.forEach((startPrice, i, a) => {
    let maxGain = 0;
    for (let j = i + 1; j < numPrices; j++) {
      // Ignore later options that have lower gain
      let curGain = Math.max(0, prices[j] - startPrice)
      if (maxGain < curGain) {
        maxGain = curGain;
        trades.push(new StockTrade(prices[i], i, prices[j], j));
      }
    }
  })

  //trades.forEach(t => ns.print(t.toString()))

  // Scanning from the last sell price, remove any trades that have lower profit
  for (let i = numPrices - 1; i > 0; i--) {
    let sellAtIndex = trades.filter(t => t.sellIndex == i).sort((a, b) => a.buyIndex - b.buyIndex);

    if (sellAtIndex?.length > 0) {
      let lastTradeValue = sellAtIndex.pop().profit();

      let tempTrade = sellAtIndex.pop();
      while (tempTrade) {
        if (tempTrade.profit() <= lastTradeValue) {
          // Spans more days, for no better profit; remove
          trades = trades.filter(t => t !== tempTrade);
        } else {
          lastTradeValue = tempTrade.profit();
        }

        tempTrade = sellAtIndex.pop()
      }
    }

  }

  trades.forEach(t => ns.print(t.toString()))

  // TODO Find the groups on overlapping trades
  // This will further segment the problem space

  // Find the highest value trade for a starting point, and ignore any after
  // E.g. if we have [1,5,2,3], we wouldn't be buying at one and selling at 3
  // But, if we have [1,4,2,5], we need to consider the 4, since we can buy at 2
  // This doesn't fully solve, but it reduces the problem space

  // Actually, do this for ANY trade values; if any later trades <= val, ignore

  // For each index, ignore later trades with lower values

  // From the tail end, ignore any trades with the upper day that have a lower profit

  // Determine the set of non-overlapping transactions with highest value
}

// 2-coloring of a graph
/** @param {NS} ns */
function twoColorGraph(ns, input) {
  let numVertices = input[0];
  let edges = input[1].sort(comparePairs);
  let vertices = arrayUnique(edges.flat()).sort()

  ns.printf('numVertices: %d', numVertices);
  ns.print(edges);
  ns.print(vertices);

  // Get a bit of text we can dump into a DOT-compatible graph env
  edges.forEach(a => ns.print('  ' + a[0] + '-->' + a[1] + ';'))

  // Check if there are any obvious conflicts, e.g. a loop of an odd number of elements
  // Can do so by checking the list of neighbors: a.neighbors.foreach(n => n.neighbors.some(b => a.neighbors.includes(b)))

}

/** @param {number[][]} matrix */
function spiralRight(ns, matrix) {
  if (!matrix) { return [] }
  let row = matrix.slice(0, 1)?.flat()
  matrix = matrix.slice(1)

  if (row) {
    row.push(spiralDown(ns, matrix))
    //ns.print(row)
    return row.flat()
  }
  return []
}

/** @param {number[][]} matrix */
function spiralDown(ns, matrix) {
  if (!matrix) { return [] }
  let column = []
  for (let i = 0; i < matrix.length; i++) {
    column.push(matrix[i].pop());
  }
  //ns.print(column)
  column.push(spiralLeft(ns, matrix))
  return column.flat()
}

/** @param {number[][]} matrix */
function spiralLeft(ns, matrix) {
  if (!matrix) { return [] }
  let row = matrix.pop()?.reverse()

  if (row) {
    //ns.print(row)
    row.push(spiralUp(ns, matrix))
    return row.flat()
  }
  return []
}

/** @param {number[][]} matrix */
function spiralUp(ns, matrix) {
  if (!matrix) { return [] }
  let column = []
  for (let i = matrix.length - 1; i >= 0; i--) {
    column.push(matrix[i].slice(0, 1))
    matrix[i] = matrix[i].slice(1)
  }
  //ns.print(column)
  column.push(spiralRight(ns, matrix))
  return column.flat()
}

/** 
 * @param {NS} ns
 * @param {number[][]} input
 */
function spiralizeMatrix(ns, input) {
  if (input.length == 0 || input[0].length == 0) {
    ns.print('[]')
    return
  }

  //ns.print(input)

  // TODO Check passing a REFERENCE to the 'result' object,
  //    rather than having to call `flat` all the time...
  let result = spiralRight(ns, input)

  ns.print(result)

}

/**
 * @param {NS} ns
 * @param {string} input
 */
function compression1(ns, input) {
  if (!input) {
    ns.print("''");
  } else {
    // Get the first character
    // Count how many in a row
    // If >9, subtract 9 and repeat

    let processing = input;
    let result = '';
    /** @type {string} */
    let char;
    /** @type {number} */
    let count;

    do {
      char = processing.charAt(0);
      count = 0;
      while (count < processing.length && processing.charAt(count) === char) {
        count++
      }

      if (processing.length !== count) {
        processing = processing.substring(count)
      } else {
        processing = undefined;
      }

      while (count > 9) {
        result += 9 + char;
        count -= 9
      }
      result += count + char;

    } while (processing)

    ns.print(result);
  }
}

/**
 * @param {NS} ns
 * @param {string} input
 */
function sanitizeParens(ns, input) {
  // (()(()(a)))))((

  ns.print("Input: " + input)

  /** @type {string} */
  let trimmed = input;

  // Remove any parens that CANNOT match
  while (trimmed.charAt(0) == ')') {
    trimmed = trimmed.substring(1)
  }
  while (trimmed.charAt(trimmed.length - 1) == '(') {
    trimmed = trimmed.substring(0, trimmed.length - 1)
  }

  ns.print("Trimmed: " + trimmed)

  // Check for any right parens that CANNOT match
  // e.g. ())a) => ()a)
  let countLeft = 0;
  let countRight = 0;
  let temp = '';
  for (let i = 0; i < trimmed.length; i++) {
    let char = trimmed.charAt(i);
    switch (char) {
      case ')':
        // Are there enough left parens
        if (countRight < countLeft) {
          countRight++;
          temp += char;
        }
        break;
      case '(':
        countLeft++;
      default:
        countRight = 0; // Avoid removing valid options
        temp += char;
    }
  }

  trimmed = temp
  ns.print('RCleaned: ' + trimmed);

  // Repeat for left parens that CANNOT match
  countLeft = 0;
  countRight = 0;
  temp = '';
  for (let i = trimmed.length - 1; i >= 0; i--) {
    let char = trimmed.charAt(i);
    switch (char) {
      case '(':
        // Are there enough right parens
        if (countLeft < countRight) {
          countLeft++;
          temp = char + temp;
        }
        break;
      case ')':
        countRight++;
      default:
        countLeft = 0; // Avoid removing valid options
        temp = char + temp;
    }
  }

  ns.print("LCleaned: " + temp)

  // TODO Check my old CS code for the parser logic
  // ... while accidental, the representation from `compression1` may help... hmm...
  // My manual approach involves counting how many opening and closing parens I have to pair them off...
  //    Right, push and pop the last operators!  While we have a left paren, push; when we get a right, pop!
  //    At least, that will VALIDATE it for us.
  //    To find the combinations, we can look at whether we have more of one side or the other.
  //    Also, check if any inner parens CANNOT be matched, e.g. "())()" - the second right paren is invalid

  // Look into another recursive algorithm that returns options for a subsection
  // (recurring theme in these problems: subdivide the problem space...)
}

/** 
 * @param {NS} ns
 * @param {number[]} input
 */
async function arrayJumpingGame(ns, input) {
  if (!input) {
    throw new Error("Invalid input for arrayJumpingGame: " + input)
  }

  if (input.length == 0) {
    throw new Error("Undefined behavior: no jumps defined")
  }

  // I would next look for the reachable index with the highest index + value
  // Then, count the jumps I found

  // TODO NEED BETTER NAMES!!!

  let jumps = 0;
  let index = 0;
  let offset = 0;
  let maxTravel = 0;
  let nextIndex = 0;

  // FIXME Something in this logic freezes the game...

  debugger

  do {
    offset = input[index]

    // TODO Needs to account for the index...
    if (offset >= input.length - 1) {
      // We can go right to the end
      ns.print('1 (true)');
      ns.print('Jumps: ' + jumps);
      return;
    }

    if (offset == 0) {
      // We cannot pass 'go'
      ns.print('0 (false)')
      return;
    }

    maxTravel = -1; // In case our highest travel is 0
    nextIndex = index;
    for (let i = index + 1; i < index + offset; i++) {
      // FIXME I suspect that this line is our off-by-one bug
      let curTravel = i - index + input[i];
      if (maxTravel < curTravel) {
        maxTravel = curTravel;
        nextIndex = i
      }
    }

    index = nextIndex;
    jumps++;

    await ns.sleep(100)
  } while (index < input.length - 1)

  ns.print('1 (true)')
  ns.print('Jumps: ' + jumps)
}