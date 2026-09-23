import { spoonacular } from "../../../app/lib/spoonacular";
import {
  cachedSearch,
  createTtlCache,
  normalizeIngredients,
} from "../../../app/lib/search-cache.mjs";
import { dishIntro, rankRecipes } from "../../../app/lib/recipes.mjs";

const MAX_LENGTH = 500;

// Lives as long as the serverless instance; the Cache-Control header below
// lets the CDN share successful results across instances too.
const cache = createTtlCache();

/**
 * One extra call describes every result at once. The introduction is a
 * nice-to-have, so a failure here still returns recipes.
 */
async function withIntros(recipes) {
  if (recipes.length === 0) return recipes;

  const { status, body } = await spoonacular("/recipes/informationBulk", {
    ids: recipes.map((recipe) => recipe.id).join(","),
    includeNutrition: false,
  });

  if (status !== 200 || !Array.isArray(body)) {
    console.info(JSON.stringify({ event: "recipe_intros", result: "skipped", status }));
    return recipes;
  }

  const intros = new Map(body.map((recipe) => [recipe.id, dishIntro(recipe)]));
  return recipes.map((recipe) => ({ ...recipe, intro: intros.get(recipe.id) || "" }));
}

async function searchSpoonacular(ingredients) {
  const { status, body } = await spoonacular("/recipes/findByIngredients", {
    ingredients,
    number: 12,
    // Minimize the ingredients you are missing, so dishes you can cook right
    // now can surface at all. Pantry staples such as salt and water do not
    // count as missing.
    ranking: 2,
    ignorePantry: true,
  });

  if (status !== 200 || !Array.isArray(body)) return { status, body };

  // Dishes needing nothing extra first, then the closest matches.
  return { status, body: rankRecipes(await withIntros(body)) };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { ingredients } = req.query;
  if (typeof ingredients !== "string" || normalizeIngredients(ingredients).length === 0) {
    return res
      .status(400)
      .json({ error: "Enter at least one ingredient to search." });
  }
  if (ingredients.length > MAX_LENGTH) {
    return res.status(400).json({ error: "That ingredient list is too long." });
  }

  const { status, body, cache: cacheResult } = await cachedSearch(ingredients, {
    cache,
    fetchRecipes: searchSpoonacular,
  });

  res.setHeader("X-Cache", cacheResult);
  // Successful results can be reused for a day; errors must never be cached.
  res.setHeader(
    "Cache-Control",
    status === 200 ? "public, s-maxage=86400, stale-while-revalidate=3600" : "no-store",
  );
  return res.status(status).json(body);
}
