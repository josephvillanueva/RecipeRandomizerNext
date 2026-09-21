export interface Ingredient {
  id: number;
  name: string;
}

/** A result from Spoonacular's findByIngredients endpoint. */
export interface IngredientMatch {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  usedIngredients: Ingredient[];
  missedIngredients: Ingredient[];
}

/** The subset of Spoonacular's random recipe that the app displays. */
export interface RandomRecipe {
  id: number;
  title: string;
  image?: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
}

export interface ApiError {
  error: string;
}

export function recipeUrl(id: number, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `https://spoonacular.com/recipes/${slug}-${id}`;
}

/**
 * Spoonacular occasionally returns an image URL with no extension (for
 * example "664087-556x370."), which fails to load. Treat those as missing.
 */
export function usableImage(url?: string): string | undefined {
  if (!url) return undefined;
  return /\.(jpe?g|png|webp|gif)$/i.test(url) ? url : undefined;
}
