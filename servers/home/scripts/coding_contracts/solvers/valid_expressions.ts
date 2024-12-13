// TODO Write the 'valid math expression' and 'IP address' solvers
export function findValidMathExpression(input: [string, number], ns: NS): string[] {
  /* Sample description:
  You are given the following string which contains only digits between 0 and 9:

 741109

 You are also given a target number of 25.
 Return all possible ways you can add the +(add), -(subtract),
 and *(multiply) operators to the string such that it evaluates
 to the target number. (Normal order of operations applies.)

 The provided answer should be an array of strings containing the valid expressions.
 The data provided by this problem is an array with two elements.
 The first element is the string of digits,
 while the second element is the target number:

 ["741109", 25]

 NOTE: The order of evaluation expects script operator precedence.
 NOTE: Numbers in the expression cannot have leading 0's.
 In other words, "1+01" is not a valid expression.

 Examples:

 Input: digits = "123", target = 6
 Output: ["1+2+3", "1*2*3"]

 Input: digits = "105", target = 5
 Output: ["1*0+5", "10-5"]
   */
const digits: string = <string>input[0];
const target: number = <number>input[1];

/*
Naive implementation:

Split `digits` into the individual characters
Take the first character
Build all possible permutations of another character (unless current is '0'!) or operator
Evaluate the resulting expressions to see if they equal `target`
 */

  return []
}


export function generateIPAddresses(input: string, ns: NS) {
  /* Sample description:
  Given the following string containing only digits,
  return an array with all possible valid IP address
  combinations that can be created from the string:

 10221213142

 Note that an octet cannot begin with a '0' unless the number itself is exactly '0'.
 For example, '192.168.010.1' is not a valid IP.

 Examples:

 25525511135 -> ["255.255.11.135", "255.255.111.35"]
 1938718066 -> ["193.87.180.66"]
   */

  /*
  Naive implementation:
  Split the input to individual characters
  Take a character; if zero, MUST be after another, or the only one in the octet.
  If taking another character would put us over 255, end the octet.

   */

}