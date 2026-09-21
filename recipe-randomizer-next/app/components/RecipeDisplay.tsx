import Image from "next/image";
import { motion } from "framer-motion";
import { recipeUrl, usableImage, type IngredientMatch } from "../lib/types";

interface RecipeDisplayProps {
  recipes: IngredientMatch[];
  ingredients: string[];
}

export default function RecipeDisplay({ recipes, ingredients }: RecipeDisplayProps) {
  if (recipes.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-lg font-semibold">No recipes found</p>
        <p className="mt-1 text-stone-600">
          Nothing uses {ingredients.join(", ")}. Try fewer ingredients, or more
          common ones.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {recipes.length} recipes
        </h2>
        <p className="text-sm text-stone-500">Best matches for what you have come first</p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, index) => {
          const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
          const coverage = total ? recipe.usedIngredientCount / total : 0;
          const image = usableImage(recipe.image);
          const missing = recipe.missedIngredients.map((i) => i.name);

          return (
            <motion.li
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-stone-100">
                {image && (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    // Only the first row is likely to be above the fold.
                    priority={index < 3}
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="font-semibold leading-snug">{recipe.title}</h3>

                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-emerald-800">
                      You have {recipe.usedIngredientCount} of {total}
                    </span>
                    <span className="text-stone-500">{Math.round(coverage * 100)}%</span>
                  </div>
                  <div
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100"
                    role="meter"
                    aria-label="Ingredients you already have"
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={recipe.usedIngredientCount}
                  >
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${coverage * 100}%` }}
                    />
                  </div>
                </div>

                {missing.length > 0 && (
                  <p className="text-sm text-stone-600">
                    <span className="font-medium text-stone-800">Missing:</span>{" "}
                    {missing.join(", ")}
                  </p>
                )}

                <a
                  href={recipeUrl(recipe.id, recipe.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-1 pt-1 font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  View recipe <span aria-hidden="true">→</span>
                  <span className="sr-only">for {recipe.title}, opens in a new tab</span>
                </a>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
