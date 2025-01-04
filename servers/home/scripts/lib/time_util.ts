/*
 * Yes, I realize that I'm largely recreating the code from `date-fns`
 * Due to how BitBurner works, external libraries can be a pain, AND
 *  `date-fns` doesn't format how I want...
 */

// Core constants for adjacent units of measure
export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;

// Aux constants for larger conversions
export const MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
export const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR;
export const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

export interface Interval {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
}

export class TimeSpan {
  readonly #millisecondPart: number;
  readonly #secondPart: number;
  readonly #minutePart: number;
  readonly #hourPart: number;

  constructor(interval: Partial<Interval>) {
    // Since the Interval interface does NOT guarantee the range of values,
    // start by combining the values
    let totalMilliseconds = 0;
    if (interval.milliseconds !== undefined) {
      totalMilliseconds += interval.milliseconds;
    }
    if (interval.seconds !== undefined) {
      totalMilliseconds += interval.seconds * MILLISECONDS_PER_SECOND;
    }
    if (interval.minutes !== undefined) {
      totalMilliseconds += interval.minutes * MILLISECONDS_PER_MINUTE;
    }
    if (interval.hours !== undefined) {
      totalMilliseconds += interval.hours * MILLISECONDS_PER_HOUR;
    }

    let remainder = totalMilliseconds;
    this.#millisecondPart = remainder % MILLISECONDS_PER_SECOND;
    remainder -= this.#millisecondPart;

    this.#secondPart = (remainder % MILLISECONDS_PER_MINUTE) / MILLISECONDS_PER_SECOND;
    remainder -= this.#secondPart * MILLISECONDS_PER_SECOND;

    this.#minutePart = (remainder % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE;
    remainder -= this.#minutePart * MILLISECONDS_PER_MINUTE;

    this.#hourPart = remainder / MILLISECONDS_PER_HOUR;
  }

  get milliseconds() {
    return this.#millisecondPart;
  }

  get seconds() {
    return this.#secondPart;
  }

  get minutes() {
    return this.#minutePart;
  }

  get hours() {
    return this.#hourPart;
  }

  static fromMilliseconds(n: number) {
    return new TimeSpan({milliseconds: n});
  }

  static fromSeconds(n: number) {
    return new TimeSpan({seconds: n});
  }

  static fromMinutes(n: number) {
    return new TimeSpan({minutes: n});
  }

  static fromHours(n: number) {
    return new TimeSpan({hours: n});
  }

  static fromDates(laterDate: Date, earlierDate: Date) {
    return this.fromMilliseconds(laterDate.valueOf() - earlierDate.valueOf());
  }
}

// REFINE I do NOT like this using `undefined` for the Locale, but...
//  don't have easy access to the Settings class...
const TWO_DIGIT_FORMATTER = new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2});
// Used if we want to output the milliseconds as well
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const THREE_DIGIT_FORMATTER = new Intl.NumberFormat(undefined, {minimumIntegerDigits: 3});
const TIMESTAMP_FORMATTER = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function formatSeconds(interval: Partial<Interval>) {
  const timeSpan = new TimeSpan(interval);

  const parts: string[] = [];
  if (timeSpan.hours > 0) {
    parts.push(`${timeSpan.hours.toString()}hr`);
  }
  if (timeSpan.minutes > 0) {
    parts.push(`${timeSpan.minutes.toString()}min`);
  }
  if (timeSpan.seconds > 0) {
    parts.push(`${timeSpan.seconds.toString()}sec`);
  }

  return parts.join(' ');
}

export function formatSecondsShort(interval: Partial<Interval>) {
  const timeSpan = new TimeSpan(interval);

  const parts: string[] = [];
  if (timeSpan.hours > 0) {
    parts.push(TWO_DIGIT_FORMATTER.format(timeSpan.hours));
  }
  parts.push(TWO_DIGIT_FORMATTER.format(timeSpan.minutes));
  parts.push(TWO_DIGIT_FORMATTER.format(timeSpan.seconds));

  return parts.join(':');
}

export function getTimeStamp(): string {
  return TIMESTAMP_FORMATTER.format(new Date());
}
