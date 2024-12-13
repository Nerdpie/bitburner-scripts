/**
 * Encryption I: Caesar Cipher
 * @param {string} input
 * @param {NS} ns
 */
export function encryption1(input: string, ns: NS): void {
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
}

/**
 * Encryption II: Vigenère Cipher
 * @param {string} input
 * @param {NS} ns
 */
export function encryption2(input: string, ns: NS): void {
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

  /*
  First, determine how we will track the substitution table;
  while comparatively trivial, building it in memory seems... inefficient.

  Once we have the substitution table, we can effectively
  take the index of the plaintext mod the length of the key to find the lookup.
   */

}