import {arrayUnique}                  from '@lib/array_util';
import {trimEndChars, trimStartChars} from '@lib/string_util';

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
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) === char) {
      count++;
    }
  }

  return count;
}

function isValidParens(input: string): boolean {
  let countLeft = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);
    switch (char) {
      case '(':
        countLeft++;
        break;
      case ')':
        if (countLeft <= 0) {
          return false;
        }
        countLeft--;
        break;
      default:
      // No-op
    }
  }

  return countLeft === 0;
}

function possibleRightCombos(input: string, excessCount: number): string[] {
  if (excessCount === 0) {
    return [input];
  }

  const temp: string[] = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === ')') {
      // We CANNOT have a valid string with a right paren at the start,
      // so skipping the additional check
      if (i === input.length - 1) {
        temp.push(input.substring(0, i));
      } else {
        temp.push(input.substring(0, i) + input.substring(i + 1));
      }
    }
  }

  return temp.flatMap(s => possibleRightCombos(s, excessCount - 1));
}

function possibleLeftCombos(input: string, excessCount: number): string[] {
  if (excessCount === 0) {
    return [input];
  }

  const temp: string[] = [];
  for (let i = input.length - 1; i >= 0; i--) {
    if (input[i] === '(') {
      // We CANNOT have a valid string with a left paren at the end,
      // so skipping the additional check
      if (i === 0) {
        temp.push(input.substring(i + 1));
      } else {
        temp.push(input.substring(0, i) + input.substring(i + 1));
      }
    }
  }

  return temp.flatMap(s => possibleLeftCombos(s, excessCount - 1));
}

// noinspection GrazieInspection - Grammar in sample description
/**
 * @param {string} input
 */
export function sanitizeParens(input: string): string[] {
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

  let trimmed: string = input;

  // Remove any parens that CANNOT match
  trimmed = trimStartChars(trimmed, ')');
  trimmed = trimEndChars(trimmed, '(');
  trimmed = cleanUnmatchableRightParens(trimmed);
  trimmed = cleanUnmatchableLeftParens(trimmed);

  const countLeft = countCharInString(trimmed, '(');
  const countRight = countCharInString(trimmed, ')');

  if (countLeft === countRight) {
    return [trimmed];
  }

  let result: string[];

  // REFINE Failing to come up with a good algorithm, so we're going to brute force it...
  if (countLeft < countRight) {
    const excessRight = countRight - countLeft;
    result = arrayUnique(possibleRightCombos(trimmed, excessRight))
      .filter(isValidParens);

  } else {
    const excessLeft = countLeft - countRight;
    result = arrayUnique(possibleLeftCombos(trimmed, excessLeft))
      .filter(isValidParens);
  }

  return result;
}
