// TODO Write solvers for the array jumping game types
export async function arrayJumpingGame(ns: NS, input: number[]) {
  return Math.min(1, await arrayJumpingGame2(ns, input));
}

/**
 * @param {NS} ns
 * @param {number[]} input
 */
export async function arrayJumpingGame2(ns: NS, input: number[]) {
  if (!input) {
    throw new Error("Invalid input for arrayJumpingGame: " + input)
  }

  if (input.length === 0) {
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

  // TODO Can we use `shift` to simplify the loop, by removing the parts we've passed?
  do {
    offset = input[index]

    // TODO Needs to account for the index...
    if (offset >= input.length - 1) {
      // We can go right to the end
      return 1;
    }

    if (offset === 0) {
      // We cannot pass 'go'
      return 0;
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
  return jumps;
}