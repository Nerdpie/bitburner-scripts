// Result of work with wings on Discord: https://discord.com/channels/415207508303544321/415247422638522395/1324843402298392658
import type {AutocompleteData} from 'NetscriptDefinitions';

/**
 * The type definition expected by `ns.flags` and `AutocompleteData.flags`
 */
export type FlagSchemaType = [string, string | number | boolean | string[]][];

type ValidFlagObject<T> = {
  [Property in keyof T as T[Property] extends (string | number | boolean | string[]) ? Property : never]: T[Property]
}

export function toFlagSchema<T extends ValidFlagObject<T>>(object: T): FlagSchemaType {
  return Object.entries(object) as FlagSchemaType;
}

// Any loose args are returned under the `_` property, so return an intersection type
export function parseNsFlags<T extends ValidFlagObject<T>>(ns: NS, flagsSchema: T): T & { '_': string[] } {
  // We assert that this is valid, since the input schema must only have valid types
  return ns.flags(toFlagSchema(flagsSchema)) as T & { '_': string[] };
}

export function parseAutocompleteFlags<T extends ValidFlagObject<T>>(data: AutocompleteData, flagsSchema: T) {
  data.flags(toFlagSchema(flagsSchema));
}
