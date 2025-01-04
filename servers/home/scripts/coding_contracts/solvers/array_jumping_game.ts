export function arrayJumpingGame(input: number[]) {
  /* Sample description:
  You are given the following array of integers:

 4,1,0,6,0,6,1,5,9,5,10,4,8,0,6,6,3,0,4,9,9,4

 Each element in the array represents your MAXIMUM jump length at that position.
 This means that if you are at position i and your maximum jump length is n,
 you can jump to any position from i to i+n.

Assuming you are initially positioned at the start of the array,
determine whether you are able to reach the last index.

 Your answer should be submitted as 1 or 0, representing true and false respectively.
   */

  // arrayJumpingGame2 returns the minimum number of jumps to complete, or 0 on failure,
  // so we just need to clamp it to a max of 1.
  return Math.min(1, arrayJumpingGame2(input));
}

/**
 * @param {number[]} input
 */
export function arrayJumpingGame2(input: number[]) {
  if (input.length === 0) {
    throw new Error("Undefined behavior: no jumps defined");
  }

  let workArray = input.slice();
  let jumpCount = 0;
  let offset = 0;

  do {
    offset = workArray[0];

    if (offset >= workArray.length - 1) {
      // We can go right to the end
      return jumpCount + 1;
    }

    if (offset === 0) {
      // We cannot pass 'go'
      return 0;
    }

    let maxTravel = 0;
    let nextIndex = 0;
    for (let i = 1; i <= offset; i++) {
      const curTravel = i + workArray[i];
      if (maxTravel < curTravel) {
        maxTravel = curTravel;
        nextIndex = i;
      }
    }

    workArray = workArray.slice(nextIndex);
    jumpCount++;

  } while (workArray.length > 0);

  return jumpCount;
}
