const ASCII_LETTER_A: number = 65;
const ASCII_LETTER_Z: number = 90;
const ALPHABET_SIZE: number = ASCII_LETTER_Z - ASCII_LETTER_A + 1;

function rotN(char: string, offset: number): string {

  // Only shifting A-Z
  const charPoint = char.charCodeAt(0);
  if (charPoint < ASCII_LETTER_A || charPoint > ASCII_LETTER_Z) {
    return char;
  }

  let shiftedPoint = charPoint - offset;

  // Wrap around
  if (shiftedPoint < ASCII_LETTER_A) {
    shiftedPoint += ALPHABET_SIZE;
  } else if (shiftedPoint > ASCII_LETTER_Z) {
    shiftedPoint -= ALPHABET_SIZE;
  }

  return String.fromCodePoint(shiftedPoint);
}

/**
 * Encryption I: Caesar Cipher
 * @param {string} input
 */
export function encryption1(input: [string, number]): string {
  /* Sample description
  Encryption I: Caesar Cipher
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Caesar cipher is one of the simplest encryption technique.
It is a type of substitution cipher in which each letter in the plaintext
is replaced by a letter some fixed number of positions down the alphabet.
For example, with a left shift of 3, D would be replaced by A,
E would become B, and A would become X (because of rotation).

You are given an array with two elements:
  ["TRASH SHIFT EMAIL PASTE SHELL", 14]
The first element is the plaintext, the second element is the left shift value.

Return the ciphertext as uppercase string. Spaces remains the same.
   */

  // ASCII codepoints for uppercase characters are from 65 (A) to 90 (Z)
  // Codepoint 32 (space) remains the same
  const plaintext: string = input[0];
  const offset: number = input[1];

  let result = '';
  for (let i = 0; i < plaintext.length; i++) {
    result += rotN(plaintext[i], offset);
  }

  return result;
}

/**
 * Encryption II: Vigenère Cipher
 * @param {string} input
 */
export function encryption2(input: [string, string]): string {
  /* Sample descriptions
  You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Vigenère cipher is a type of polyalphabetic substitution. It uses the Vigenère square to encrypt and decrypt plaintext with a keyword.

  Vigenère square:
         A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
       +----------------------------------------------------
     A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
     B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
     C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
     D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
     E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
                ...
     Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
     Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y

For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword. For example, the plaintext DASHBOARD is encrypted with the keyword LINUX:
   Plaintext: DASHBOARD
   Keyword:   LINUXLINU
So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the Vigenère square are used to get the first cipher letter O. This must be repeated for the whole ciphertext.

You are given an array with two elements:
  ["TRASHQUEUEFRAMEMEDIAMACRO", "BROWSER"]
The first element is the plaintext, the second element is the keyword.

Return the ciphertext as uppercase string.


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.
   */

  // Treat the substitution table as a sum of offsets, with A as 0
  const plaintext = input[0];
  const keyword = input[1];
  const keywordOffsets: number[] = Array<number>(keyword.length);
  let result = '';

  for (let i = 0; i < keyword.length; i++) {
    keywordOffsets[i] = keyword.charCodeAt(i) - ASCII_LETTER_A;
  }

  for (let i = 0; i < plaintext.length; i++) {
    const plaintextOffset = plaintext.charCodeAt(i) - ASCII_LETTER_A;

    // Take the sum of the two offsets, wrapping around the end of the keyword & alphabet size
    const charOffset = (plaintextOffset + keywordOffsets[i % keywordOffsets.length]) % ALPHABET_SIZE;

    result += String.fromCodePoint(charOffset + ASCII_LETTER_A);
  }

  return result;
}
