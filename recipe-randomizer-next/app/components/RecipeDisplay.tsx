import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { recipeUrl, usableImage, type IngredientMatch } from "../lib/types";

interface RecipeDisplayProps {
  recipes: IngredientMatch[];
  ingredients: string[];
}

export default function RecipeDisplay({ recipes, ingredients }: RecipeDisplayProps) {
  const reduceMotion = useReducedMotion();

  if (recipes.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-lg font-semibold">No recipes found</p>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Nothing uses {ingredients.join(", ")}. Try fewer ingredients, or more
          common ones.
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight">{recipes.length} recipes</h2>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Sorted so the ones using most of your ingredients come first.
      </p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, index) => {
          const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
          const image = usableImage(recipe.image);
          const missing = recipe.missedIngredients.map((i) => i.name);

          return (
            <motion.li
              key={recipe.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index, 8) * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800">
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

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-semibold leading-snug">{recipe.title}</h3>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  You have {recipe.usedIngredientCount} of {total} ingredients
                </p>
                {missing.length > 0 && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Still need {missing.join(", ")}
                  </p>
                )}
                <a
                  href={recipeUrl(recipe.id, recipe.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto pt-2 font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
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
