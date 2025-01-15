export type Integer = number & {
    __Integer: true;
};
export type SafeInteger = Integer & {
    __isSafe: true;
};
export type PositiveNumber = number & {
    __Positive: true;
};
export type PositiveInteger = Integer & PositiveNumber;
export type PositiveSafeInteger = PositiveInteger & SafeInteger;
export declare const isNumber: (n: unknown) => n is number;
export declare const isInteger: (n: unknown) => n is Integer;
export declare const isSafeInteger: (n: unknown) => n is SafeInteger;
export declare const isPositiveInteger: (n: unknown) => n is PositiveInteger;
export declare const isPositiveNumber: (n: unknown) => n is PositiveNumber;
export declare const isPositiveSafeInteger: (n: unknown) => n is PositiveSafeInteger;
/** Utility type for typechecking objects. Makes all keys optional and sets values to unknown,
 * making it safe to assert a shape for the variable once it's known to be a non-null object */
export type Unknownify<T> = {
    [key in keyof T]?: unknown;
};
/** Get the member type of either an array or an object */
export type Member<T> = T extends (infer arrayMember)[] ? arrayMember : T[keyof T];
export type TypedKeys<Obj, T> = {
    [K in keyof Obj]-?: Obj[K] extends T ? K : never;
}[keyof Obj];
/** Status object for functions that return a boolean indicating success/failure
 * and an optional message */
export interface IReturnStatus {
    res: boolean;
    msg?: string;
}
type SuccessResult<T extends object> = {
    success: true;
    message?: string;
} & T;
type FailureResult = {
    success: false;
    message: string;
};
export type Result<T extends object = object> = SuccessResult<T> | FailureResult;
/** Defines the minimum and maximum values for a range.
 * It is up to the consumer if these values are inclusive or exclusive.
 * It is up to the implementor to ensure max > min. */
export interface IMinMaxRange {
    /** Value by which the bounds are to be divided for the final range */
    divisor?: number;
    /** The maximum bound of the range. */
    max: number;
    /** The minimum bound of the range. */
    min: number;
}
export type SaveData = string | Uint8Array;
export {};
