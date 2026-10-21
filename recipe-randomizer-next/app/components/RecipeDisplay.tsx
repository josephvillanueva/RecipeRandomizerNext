import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { recipeUrl, usableImage, type IngredientMatch } from "../lib/types";
import { ingredientLabels } from "../lib/recipes.mjs";

interface RecipeDisplayProps {
  recipes: IngredientMatch[];
  ingredients: string[];
}

function Pills({ label, items, tone }: { label: string; items: string[]; tone: "have" | "missing" }) {
  if (items.length === 0) return null;

  const styles =
    tone === "have"
      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
      : "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200";

  return (
    <div>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label={label}>
        {items.map((item) => (
          <li
            key={item}
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecipeCard({ recipe, index }: { recipe: IngredientMatch; index: number }) {
  const reduceMotion = useReducedMotion();
  const image = usableImage(recipe.image);
  const have = ingredientLabels(recipe.usedIngredients);
  const missing = ingredientLabels(recipe.missedIngredients);

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index, 8) * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="relative aspect-4/3 bg-zinc-100 dark:bg-zinc-800">
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

        {recipe.intro && (
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {recipe.intro}
          </p>
        )}

        <Pills label="You have" items={have} tone="have" />
        <Pills label="Still need" items={missing} tone="missing" />

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
}

export default function RecipeDisplay({ recipes, ingredients }: RecipeDisplayProps) {
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

  // The API returns these in order: nothing missing first.
  const complete = recipes.filter((recipe) => recipe.missedIngredientCount === 0);
  const partial = recipes.filter((recipe) => recipe.missedIngredientCount > 0);

  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight">{recipes.length} recipes</h2>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        {complete.length > 0
          ? "Dishes you can cook with only what you have come first."
          : "Nothing matches your ingredients exactly, so these need a few extras."}
      </p>

      {complete.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            Cook with what you have
          </h3>
          <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {complete.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </ul>
        </>
      )}

      {partial.length > 0 && (
        <>
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
            {complete.length > 0 ? "A few extras needed" : "Closest matches"}
          </h3>
          <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partial.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
