// Caching for ingredient searches, so repeated searches do not spend the
// Spoonacular free-tier quota. Kept free of Next.js imports so it can be unit
// tested with `node --test`.

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Lowercases, trims, de-duplicates, and sorts ingredients, so "Rice, chicken"
 * and "chicken,rice" produce the same list and therefore the same cache key.
 */
export function normalizeIngredients(input) {
  const parts = Array.isArray(input) ? input : String(input ?? "").split(",");
  const cleaned = parts.map((part) => part.trim().toLowerCase()).filter(Boolean);
  return [...new Set(cleaned)].sort();
}

/**
 * A small in-memory cache with a time-to-live and a size cap. The oldest
 * entry is evicted first. Each serverless instance keeps its own copy.
 */
export function createTtlCache({ ttlMs = CACHE_TTL_MS, maxEntries = 500, now = Date.now } = {}) {
  const entries = new Map();

  return {
    get(key) {
      const entry = entries.get(key);
      if (!entry) return undefined;
      if (now() - entry.storedAt >= ttlMs) {
        entries.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value) {
      entries.delete(key);
      entries.set(key, { value, storedAt: now() });
      if (entries.size > maxEntries) entries.delete(entries.keys().next().value);
    },
    get size() {
      return entries.size;
    },
  };
}

/**
 * Returns { status, body, cache } for an ingredient search, serving a cached
 * result when one exists. Only successful responses are cached.
 */
export async function cachedSearch(ingredients, { cache, fetchRecipes, log = console.info }) {
  const key = normalizeIngredients(ingredients).join(",");

  const hit = cache.get(key);
  if (hit) {
    log(JSON.stringify({ event: "recipe_search_cache", result: "hit", key }));
    return { status: 200, body: hit, cache: "HIT" };
  }

  const { status, body } = await fetchRecipes(key);
  if (status === 200) cache.set(key, body);
  log(JSON.stringify({ event: "recipe_search_cache", result: "miss", key, status }));
  return { status, body, cache: "MISS" };
}
