import { test } from "node:test";
import assert from "node:assert/strict";
import { cachedSearch, createTtlCache, normalizeIngredients } from "../app/lib/search-cache.mjs";

const quiet = () => {};

test("normalizes order, case, spacing, and duplicates", () => {
  assert.deepEqual(normalizeIngredients("Rice, chicken"), ["chicken", "rice"]);
  assert.deepEqual(normalizeIngredients(["chicken", " RICE ", "rice", ""]), ["chicken", "rice"]);
  assert.deepEqual(normalizeIngredients(" , "), []);
});

test("equivalent searches share one upstream call", async () => {
  let calls = 0;
  const fetchRecipes = async () => ({ status: 200, body: [{ id: ++calls }] });
  const cache = createTtlCache();

  const first = await cachedSearch("Rice, chicken", { cache, fetchRecipes, log: quiet });
  const second = await cachedSearch("chicken,rice", { cache, fetchRecipes, log: quiet });

  assert.equal(calls, 1);
  assert.equal(first.cache, "MISS");
  assert.equal(second.cache, "HIT");
  assert.deepEqual(second.body, first.body);
});

test("entries expire after the time-to-live", async () => {
  let clock = 0;
  let calls = 0;
  const cache = createTtlCache({ ttlMs: 1000, now: () => clock });
  const fetchRecipes = async () => ({ status: 200, body: [++calls] });

  await cachedSearch("egg", { cache, fetchRecipes, log: quiet });
  clock = 999;
  await cachedSearch("egg", { cache, fetchRecipes, log: quiet });
  clock = 1000;
  await cachedSearch("egg", { cache, fetchRecipes, log: quiet });

  assert.equal(calls, 2);
});

test("errors are never cached", async () => {
  let calls = 0;
  const cache = createTtlCache();
  const fetchRecipes = async () => {
    calls += 1;
    return { status: 429, body: { error: "quota" } };
  };

  await cachedSearch("egg", { cache, fetchRecipes, log: quiet });
  const second = await cachedSearch("egg", { cache, fetchRecipes, log: quiet });

  assert.equal(calls, 2);
  assert.equal(second.cache, "MISS");
  assert.equal(cache.size, 0);
});

test("logs hits and misses so the hit rate can be measured", async () => {
  const lines = [];
  const log = (line) => lines.push(JSON.parse(line));
  const cache = createTtlCache();
  const fetchRecipes = async () => ({ status: 200, body: [] });

  await cachedSearch("egg", { cache, fetchRecipes, log });
  await cachedSearch("EGG", { cache, fetchRecipes, log });

  assert.deepEqual(lines.map((line) => line.result), ["miss", "hit"]);
});

test("evicts the oldest entry beyond the size cap", () => {
  const cache = createTtlCache({ maxEntries: 2 });
  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);

  assert.equal(cache.get("a"), undefined);
  assert.equal(cache.get("c"), 3);
});
