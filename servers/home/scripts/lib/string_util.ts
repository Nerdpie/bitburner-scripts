/**
 * String utilities for other scripts
 * @todo Does not properly handle Unicode sequences!
 */

/**
 * Remove the specified characters from the start of a string
 * @param str
 * @param chars
 */
export function trimStartChars(str: string, chars: string):string {
  let index = 0;
  while (index < str.length && chars.includes(str.charAt(index))) {
    index++;
  }

  // Already clean; don't bother running `substring`
  if (index === 0) {
    return str;
  }

  // All characters should be trimmed
  if (index === str.length) {
    return '';
  }

  return str.substring(index);
}

/**
 * Remove the specified characters from the end of a string
 * @param str
 * @param chars
 */
export function trimEndChars(str: string, chars: string):string {
  let index = str.length;
  while (index > 0 && chars.includes(str.charAt(index - 1))) {
    index--;
  }

  // Already clean; don't bother running `substring`
  if (index === str.length) {
    return str;
  }

  // All characters should be trimmed
  if (index === 0) {
    return '';
  }

  return str.substring(0, index);
}

/**
 * Removes the specified characters from the start and end of a string
 * @param str
 * @param chars
 * @see https://stackoverflow.com/a/77885632 for original source
 */
export function trimChars(str: string, chars: string):string {
  let start = 0;
  let end = str.length;

  while (start < end && chars.includes(str.charAt(start))) {
    start++;
  }

  while (end > start && chars.includes(str.charAt(end - 1))) {
    end--;
  }

  // Already clean; don't bother running `substring`
  if (start === 0 && end === str.length) {
    return str
  }

  // All characters should be trimmed
  if (start === end) {
    return '';
  }

  return str.substring(start, end)
}