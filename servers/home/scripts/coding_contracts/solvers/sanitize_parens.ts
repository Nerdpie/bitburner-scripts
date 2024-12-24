import {trimEndChars, trimStartChars} from "@/servers/home/scripts/lib/string_util";

function cleanUnmatchableRightParens(input: string) {
  // Check for any right parens that CANNOT match
  // e.g. ())a) => ()a)
  let countLeft = 0;
  let countRight = 0;
  let temp = '';
  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);
    switch (char) {
      case ')':
        // Are there enough left parens
        if (countRight < countLeft) {
          countRight++;
          temp += ')';
        }
        break;
      case '(':
        countLeft++;
        countRight = 0; // Avoid removing valid options
        temp += '(';
        break;
      default:
        countRight = 0; // Avoid removing valid options
        temp += char;
    }
  }
  return temp;
}

function cleanUnmatchableLeftParens(input: string) {
  // Check for any left parens that CANNOT match
  // e.g. (a(() => (a()
  let countLeft = 0;
  let countRight = 0;
  let temp = '';
  for (let i = input.length - 1; i >= 0; i--) {
    const char = input.charAt(i);
    switch (char) {
      case '(':
        // Are there enough right parens
        if (countLeft < countRight) {
          countLeft++;
          temp = '(' + temp;
        }
        break;
      case ')':
        countRight++;
        countLeft = 0; // Avoid removing valid options
        temp = ')' + temp;
        break;
      default:
        countLeft = 0; // Avoid removing valid options
        temp = char + temp;
    }
  }
  return temp;
}

function countCharInString(input: string, char: string): number {
  let count = 0
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) === char) {
      count++;
    }
  }

  return count;
}

// noinspection GrazieInspection - Grammar in sample description
/**
 * @param {string} input
 * @param {NS} ns
 */
export function sanitizeParens(input: string, ns: NS): string[] {
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

  let trimmed: string = input;

  // Remove any parens that CANNOT match
  trimmed = trimStartChars(trimmed, ')');
  trimmed = trimEndChars(trimmed, '(');

  ns.print("Trimmed: " + trimmed)

  trimmed = cleanUnmatchableRightParens(trimmed);

  ns.print('RCleaned: ' + trimmed);

  trimmed = cleanUnmatchableLeftParens(trimmed);

  ns.print("LCleaned: " + trimmed)

  const countLeft = countCharInString(trimmed, '(');
  const countRight = countCharInString(trimmed, ')');

  if ( countLeft === countRight ) {
    return [trimmed];
  }

  ns.print(`LCount: ${countLeft}`);
  ns.print(`RCount: ${countRight}`);

  // TODO Check my old CS code for the parser logic
  // ... while accidental, the representation from `compression1` may help... hmm...
  // My manual approach involves counting how many opening and closing parens I have to pair them off...
  //    Right, push and pop the last operators!  While we have a left paren, push; when we get a right, pop!
  //    At least, that will VALIDATE it for us.
  //    To find the combinations, we can look at whether we have more of one side or the other.
  //    Also, check if any inner parens CANNOT be matched, e.g. "())()" - the second right paren is invalid

  // Look into another recursive algorithm that returns options for a subsection
  // (recurring theme in these problems: subdivide the problem space...)

  return [''];
}