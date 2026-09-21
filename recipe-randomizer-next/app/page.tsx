"use client";

import { useState } from "react";
import RecipeFilter from "./components/RecipeFilter";
import RecipeDisplay from "./components/RecipeDisplay";
import RandomRecipeCard from "./components/RandomRecipeCard";
import type { ApiError, IngredientMatch, RandomRecipe } from "./lib/types";

type ViewState =
  | { kind: "idle" }
  | { kind: "loading"; label: string }
  | { kind: "error"; message: string }
  | { kind: "matches"; ingredients: string[]; recipes: IngredientMatch[] }
  | { kind: "random"; recipe: RandomRecipe };

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const body = (await response.json().catch(() => ({}))) as T & ApiError;
  if (!response.ok) {
    throw new Error(body.error ?? "Something went wrong. Please try again.");
  }
  return body;
}

export default function Page() {
  const [view, setView] = useState<ViewState>({ kind: "idle" });

  const findRecipes = async (ingredients: string[]) => {
    setView({ kind: "loading", label: "Finding recipes that use what you have" });
    try {
      const recipes = await getJson<IngredientMatch[]>(
        `/api/recipes/filter?${new URLSearchParams({ ingredients: ingredients.join(",") })}`,
      );
      setView({ kind: "matches", ingredients, recipes });
    } catch (error) {
      setView({ kind: "error", message: (error as Error).message });
    }
  };

  const surpriseMe = async () => {
    setView({ kind: "loading", label: "Picking a recipe for you" });
    try {
      const recipe = await getJson<RandomRecipe>("/api/recipes/random");
      setView({ kind: "random", recipe });
    } catch (error) {
      setView({ kind: "error", message: (error as Error).message });
    }
  };

  return (
    <div className="min-h-[100dvh]">
      <header className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-12 sm:pt-16">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Cook with what you have
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Recipe Randomizer
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Add what&apos;s in your kitchen and see which recipes use the most
            of it.
          </p>

          <div className="mt-8">
            <RecipeFilter
              onSearch={findRecipes}
              onSurprise={surpriseMe}
              onClear={() => setView({ kind: "idle" })}
              busy={view.kind === "loading"}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10" aria-live="polite">
        {view.kind === "idle" && (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            Add a few ingredients above, or press Surprise me if you can&apos;t
            decide.
          </p>
        )}
        {view.kind === "loading" && <LoadingGrid label={view.label} />}
        {view.kind === "error" && (
          <p
            role="alert"
            className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          >
            {view.message}
          </p>
        )}
        {view.kind === "matches" && (
          <RecipeDisplay recipes={view.recipes} ingredients={view.ingredients} />
        )}
        {view.kind === "random" && (
          <RandomRecipeCard recipe={view.recipe} onAnother={surpriseMe} />
        )}
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Recipe data from Spoonacular. Built by{" "}
        <a
          className="font-medium text-zinc-700 underline dark:text-zinc-200"
          href="https://joseph-villanueva-portfolio.vercel.app"
        >
          Joseph Villanueva
        </a>
      </footer>
    </div>
  );
}

function LoadingGrid({ label }: { label: string }) {
  return (
    <div>
      <p className="mb-4 text-zinc-600 dark:text-zinc-400">{label}</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="aspect-[4/3] animate-pulse bg-zinc-100 dark:bg-zinc-800" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
