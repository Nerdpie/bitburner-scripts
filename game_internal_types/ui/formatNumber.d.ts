import { EventEmitter } from "../utils/EventEmitter";
/** Event to be emitted when changing number display settings. */
export declare const FormatsNeedToChange: EventEmitter<any[]>;
/** Event to be emitted after the cached formatters are cleared. */
export declare const FormatsHaveChanged: EventEmitter<any[]>;
/** Display standard ram formatting. */
export declare function formatRam(n: number, fractionalDigits?: number): string;
export declare function formatPercent(n: number, fractionalDigits?: number, multStart?: number): string;
export declare function formatNumber(n: number, fractionalDigits?: number, suffixStart?: number, isInteger?: boolean): string;
/** Format a number without suffixes. Still show exponential form if >= 1e33. */
export declare const formatNumberNoSuffix: (n: number, fractionalDigits?: number) => string;
export declare const formatFavor: (n: number) => string;
/** Standard noninteger formatting with no options set. Collapses to suffix at 1000 and shows 3 fractional digits. */
export declare const formatBigNumber: (n: number) => string;
export declare const formatExp: (n: number) => string;
export declare const formatHashes: (n: number) => string;
export declare const formatReputation: (n: number) => string;
export declare const formatPopulation: (n: number) => string;
export declare const formatSecurity: (n: number) => string;
export declare const formatStamina: (n: number) => string;
export declare const formatStaneksGiftCharge: (n: number) => string;
export declare const formatCorpMultiplier: (n: number) => string;
/** Format a number with suffixes starting at 1000 and 2 fractional digits */
export declare const formatQuality: (n: number) => string;
/** Format an integer that uses suffixed form at 1000 and 3 fractional digits. */
export declare const formatInt: (n: number) => string;
export declare const formatSleeveMemory: (n: number) => string;
export declare const formatShares: (n: number) => string;
/** Display an integer up to 999,999 before collapsing to suffixed form with 3 fractional digits */
export declare const formatHp: (n: number) => string;
export declare const formatThreads: (n: number) => string;
/** Display an integer up to 999,999,999 before collapsing to suffixed form with 3 fractional digits */
export declare const formatSkill: (n: number) => string;
/** Display standard money formatting, including the preceding $. */
export declare const formatMoney: (n: number) => string;
/** Display a decimal number with increased precision (5 fractional digits) */
export declare const formatRespect: (n: number) => string;
export declare const formatWanted: (n: number) => string;
export declare const formatPreciseMultiplier: (n: number) => string;
/** Format a number with 3 fractional digits. */
export declare const formatMaterialSize: (n: number) => string;
/** Format a number with no suffix and 2 fractional digits. */
export declare const formatMultiplier: (n: number) => string;
export declare const formatStaneksGiftPower: (n: number) => string;
export declare const formatMatPurchaseAmount: (n: number) => string;
/** Format a number with no suffix and 3 fractional digits. */
export declare const formatSleeveShock: (n: number) => string;
export declare const formatSleeveSynchro: (n: number) => string;
export declare const formatCorpStat: (n: number) => string;
/** Parsing numbers does not use the locale as this causes complications. */
export declare function parseBigNumber(str: string): number;
