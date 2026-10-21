// Shaping of Spoonacular search results: ordering, readable ingredient
// names, and a one line introduction to each dish. Kept free of Next.js
// imports so it can be unit tested with `node --test`.

/**
 * Spoonacular's `summary` field is marketing copy rather than a description.
 * Across the live results we sampled it always opened with diet labels and
 * macros ("is a gluten free and dairy free main course. One portion contains
 * roughly 44g of protein"), which says nothing about the dish. The structured
 * fields in the same response do, so the card introduces a dish with those.
 *
 * Returns an empty string when there is nothing worth saying, and the card
 * falls back to showing just the title.
 */
export function dishIntro(recipe) {
  if (!recipe) return "";

  const kind = [firstLabel(recipe.cuisines), firstLabel(recipe.dishTypes)]
    .filter(Boolean)
    .join(" ");

  // Time and servings on their own read like a spec sheet, not an
  // introduction, so they only ever follow the kind of dish.
  if (!kind) return "";

  const parts = [kind];

  const minutes = Number(recipe.readyInMinutes);
  if (Number.isFinite(minutes) && minutes > 0) parts.push(`ready in ${minutes} minutes`);

  const servings = Number(recipe.servings);
  if (Number.isFinite(servings) && servings > 0) {
    parts.push(servings === 1 ? "serves 1" : `serves ${servings}`);
  }

  return `${parts.join(", ").replace(/^./, (character) => character.toUpperCase())}.`;
}

/** The first entry is the most specific label Spoonacular has. */
function firstLabel(values) {
  if (!Array.isArray(values)) return "";

  const label = String(values[0] ?? "")
    .replace(/\s+/g, " ")
    .trim();

  return label.length > 24 ? "" : label;
}

/**
 * Spoonacular sometimes returns an ingredient "name" that is really a
 * fragment of the method ("in a soup pot over heat, stir in the onions").
 * Keep the first clause and a sensible length so it fits on a pill.
 */
export function ingredientLabel(name, maxLength = 24) {
  const first = String(name ?? "")
    .split(/[,;(]/)[0]
    .replace(/\s+/g, " ")
    .trim();

  if (!first) return "";
  if (first.length <= maxLength) return first;

  const clipped = first.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}...`;
}

/** Readable, de-duplicated ingredient labels, in their original order. */
export function ingredientLabels(ingredients) {
  const seen = new Set();
  const labels = [];

  for (const ingredient of ingredients ?? []) {
    const label = ingredientLabel(ingredient?.name);
    const key = label.toLowerCase();
    if (!label || seen.has(key)) continue;
    seen.add(key);
    labels.push(label);
  }

  return labels;
}

/**
 * Dishes that need nothing extra come first, then the ones missing the
 * fewest ingredients. Ties go to the recipe using more of what you have,
 * then to the more popular one.
 */
export function rankRecipes(recipes) {
  return [...(recipes ?? [])].sort(
    (a, b) =>
      (a.missedIngredientCount ?? 0) - (b.missedIngredientCount ?? 0) ||
      (b.usedIngredientCount ?? 0) - (a.usedIngredientCount ?? 0) ||
      (b.likes ?? 0) - (a.likes ?? 0) ||
      String(a.title ?? "").localeCompare(String(b.title ?? "")),
  );
}
