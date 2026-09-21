import Image from "next/image";
import { motion } from "framer-motion";
import { recipeUrl, usableImage, type RandomRecipe } from "../lib/types";

interface RandomRecipeCardProps {
  recipe: RandomRecipe;
  onAnother: () => void;
}

export default function RandomRecipeCard({ recipe, onAnother }: RandomRecipeCardProps) {
  const image = usableImage(recipe.image);
  const link =
    recipe.sourceUrl ?? recipe.spoonacularSourceUrl ?? recipeUrl(recipe.id, recipe.title);
  const facts = [
    recipe.readyInMinutes && `Ready in ${recipe.readyInMinutes} min`,
    recipe.servings && `Serves ${recipe.servings}`,
  ].filter(Boolean) as string[];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-stone-200 md:grid-cols-2"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-emerald-100 md:aspect-auto">
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
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          Tonight you could make
        </p>
        <h2 className="text-3xl font-bold leading-tight tracking-tight">{recipe.title}</h2>

        {facts.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {facts.map((fact) => (
              <li
                key={fact}
                className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700"
              >
                {fact}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800"
          >
            Get the recipe
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={onAnother}
            className="rounded-xl px-5 py-2.5 font-semibold text-stone-700 ring-1 ring-stone-300 hover:bg-stone-50"
          >
            Pick another
          </button>
        </div>
      </div>
    </motion.article>
  );
}
