export function algoStockTrade1(input: number[]): number {
  let maxProfit = 0;

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      maxProfit = Math.max(maxProfit, input[j] - input[i]);
    }
  }

  return maxProfit;
}

// algoStockTrade2 - sum all increases in value
/**
 * @param {number[]} input
 */
export function algoStockTrade2(input: number[]): number {
  // Using `reduce` isn't any more concise...
  let sum = 0;

  for (let i = 1; i < input.length; i++) {
    sum += Math.max(0, input[i] - input[i - 1]);
  }

  return sum;
}

class StockTrade {
  constructor(buyValue: number, buyIndex: number, sellValue: number, sellIndex: number) {
    this.buyValue = buyValue;
    this.buyIndex = buyIndex;
    this.sellValue = sellValue;
    this.sellIndex = sellIndex;
  }

  buyValue: number = 0;
  buyIndex: number = 0;
  sellValue: number = 0;
  sellIndex: number = 0;

  get profit(): number {
    return this.sellValue - this.buyValue
  }

  toString(): string {
    return `[${this.buyIndex},${this.buyValue}] => [${this.sellIndex},${this.sellValue}] = ${this.profit}`
  }
}

/**
 * @param {number[]} input
 * @param {NS} ns
 */
export function algoStockTrade3(input: number[], ns: NS): number {
  return algoStockTrade4([2, input], ns);
}

/**
 * @param {[number, number[]]} input
 * @param {NS} ns
 */
export function algoStockTrade4(input: [number, number[]], ns: NS): number {
  const numTrades: number = input[0];
  const prices: number[] = input[1];
  let numPrices = prices.length;


  // REFINE Implement the comparison that MaxMinMedian shared: https://discord.com/channels/415207508303544321/923282733332054126/1321371942304874496
  //  (y - x) * (y - z) <=0
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
    return 0;
  }

  //ns.print(prices);

  /** @type {StockTrade[]} */
  let trades: StockTrade[] = [];

  // Find each pair of POSSIBLE transactions
  prices.forEach((startPrice: number, i: number) => {
    let maxGain = 0;
    for (let j = i + 1; j < numPrices; j++) {
      // Ignore later options that have lower gain
      const curGain = Math.max(0, prices[j] - startPrice);
      if (maxGain < curGain) {
        maxGain = curGain;
        trades.push(new StockTrade(prices[i], i, prices[j], j));
      }
    }
  })

  //trades.forEach(t => ns.print(t.toString()))

  // Scanning from the last sell price, remove any trades that have lower profit
  for (let i = numPrices - 1; i > 0; i--) {
    const sellAtIndex: StockTrade[] = trades.filter(t => t.sellIndex === i).sort((a, b) => a.buyIndex - b.buyIndex);

    if (sellAtIndex?.length > 0) {
      let lastTradeValue = sellAtIndex.pop().profit;

      let tempTrade = sellAtIndex.pop();
      while (tempTrade) {
        if (tempTrade.profit <= lastTradeValue) {
          // Spans more days, for no better profit; remove
          trades = trades.filter(t => t !== tempTrade);
        } else {
          lastTradeValue = tempTrade.profit;
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

  // Determine the set of non-overlapping transactions with the highest value
}