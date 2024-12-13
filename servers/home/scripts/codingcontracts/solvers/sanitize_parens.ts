// REFINE Remove this suppression once the algo is done
// noinspection GrazieInspection - Grammar in sample description
/**
 * @param {string} input
 * @param {NS} ns
 */
export function sanitizeParens(input: string, ns: NS): void {
  /* Sample description:
  Given the following string:

 ()(a)(()(

 remove the minimum number of invalid parentheses in order to validate the string.
 If there are multiple minimal ways to validate the string,
 provide all of the possible results.
 The answer should be provided as an array of strings.
 If it is impossible to validate the string the result
 should be an array with only an empty string.

 IMPORTANT: The string may contain letters, not just parentheses.

 Examples:

 "()())()" -> ["()()()", "(())()"]
 "(a)())()" -> ["(a)()()", "(a())()"]
 ")(" -> [""]
   */

  ns.print("Input: " + input)

  /** @type {string} */
  let trimmed = input;

  // Remove any parens that CANNOT match
  while (trimmed.charAt(0) === ')') {
    trimmed = trimmed.substring(1)
  }
  while (trimmed.charAt(trimmed.length - 1) === '(') {
    trimmed = trimmed.substring(0, trimmed.length - 1)
  }

  ns.print("Trimmed: " + trimmed)

  // Check for any right parens that CANNOT match
  // e.g. ())a) => ()a)
  let countLeft = 0;
  let countRight = 0;
  let temp = '';
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed.charAt(i);
    // noinspection FallThroughInSwitchStatementJS - We reset `countRight` for either case
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
    const char = trimmed.charAt(i);
    // noinspection FallThroughInSwitchStatementJS - We reset `countLeft` for either case
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