/**
 * Deep clone util using structuredClone (same as deep-merge.ts).
 * Falls back to JSON serialization if structuredClone is unavailable.
 */
export const deepClone = <T extends { [key: string]: any }>(object: T) =>
  typeof structuredClone !== "undefined"
    ? structuredClone(object)
    : (JSON.parse(JSON.stringify(object)) as T);
