/**
 * Safely serialize data for passing from Server Components to Client Components.
 * Strips non-serializable Prisma metadata (like Decimal, Date objects) by
 * round-tripping through JSON. Uses a single utility so we can swap the
 * implementation later (e.g. superjson) without touching every page.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
