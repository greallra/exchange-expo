/**
 * Its Types (e.g. enums) + constants :)
 * Its okay for high reuse portions to belong in types, however don't pollute it with specific types. 
 * 
 * Specific types can be (should be) closer to their reference e.g. react style props belong next to (in the same file as) the react component.
 */

export const cacheDir = './.alm';
export const title = "Application Lifecycle Management tools for TypeScript";

export enum TriState {
    Unknown,
    True,
    False,
}

export interface exchange {
    name: string
}
export interface user {
    username: string
}

