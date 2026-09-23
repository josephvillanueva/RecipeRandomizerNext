// Shaping of Spoonacular search results: ordering, readable ingredient
// names, and a short dish summary. Kept free of Next.js imports so it can be
// unit tested with `node --test`.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };

/**
 * Turns Spoonacular's HTML summary into one or two plain sentences. Returns
 * an empty string when there is nothing usable, so the card falls back to
 * showing just the title.
 */
export function plainSummary(html, maxLength = 180) {
  if (!html) return "";

  const text = String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&([a-z#0-9]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  // Prefer cutting at the end of a sentence, then at a word boundary.
  const clipped = text.slice(0, maxLength);
  const lastStop = clipped.lastIndexOf(". ");
  if (lastStop > maxLength * 0.4) return clipped.slice(0, lastStop + 1);

  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}...`;
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
