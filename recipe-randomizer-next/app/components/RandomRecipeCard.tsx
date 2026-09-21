import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { recipeUrl, usableImage, type RandomRecipe } from "../lib/types";

interface RandomRecipeCardProps {
  recipe: RandomRecipe;
  onAnother: () => void;
}

export default function RandomRecipeCard({ recipe, onAnother }: RandomRecipeCardProps) {
  const reduceMotion = useReducedMotion();
  const image = usableImage(recipe.image);
  const link =
    recipe.sourceUrl ?? recipe.spoonacularSourceUrl ?? recipeUrl(recipe.id, recipe.title);
  const facts = [
    recipe.readyInMinutes && `Ready in ${recipe.readyInMinutes} min`,
    recipe.servings && `Serves ${recipe.servings}`,
  ].filter(Boolean) as string[];

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-white md:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-[4/3] bg-zinc-100 md:aspect-auto dark:bg-zinc-800">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 448px, 100vw"
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <p className="text-zinc-600 dark:text-zinc-400">Tonight you could make</p>
        <h2 className="-mt-2 text-3xl font-bold leading-tight tracking-tight">
          {recipe.title}
        </h2>

        {facts.length > 0 && (
          <p className="text-zinc-700 dark:text-zinc-300">{facts.join(", ")}</p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
          >
            View recipe
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={onAnother}
            className="rounded-xl border border-zinc-300 px-5 py-2.5 font-semibold text-zinc-800 transition hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Pick another
          </button>
        </div>
      </div>
    </motion.article>
  );
}
