/**
 * Safely serialize data for passing from Server Components to Client Components.
 * Strips non-serializable Prisma metadata (like Decimal, Date objects) by
 * round-tripping through JSON. Returns a plain JSON-safe copy.
 *
 * Note: Uses `any` return to avoid Prisma type mismatches between server-side
 * types (with relation metadata) and client-side prop types (plain objects).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialize<T>(data: T): any {
  return JSON.parse(JSON.stringify(data))
}
