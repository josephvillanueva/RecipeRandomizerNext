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
    setView({ kind: "loading", label: "Finding recipes that use what you have..." });
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
    setView({ kind: "loading", label: "Picking something for you..." });
    try {
      const recipe = await getJson<RandomRecipe>("/api/recipes/random");
      setView({ kind: "random", recipe });
    } catch (error) {
      setView({ kind: "error", message: (error as Error).message });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50">
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-12 sm:pt-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Cook with what you have
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Recipe Randomizer
          </h1>
          <p className="mt-3 max-w-xl text-lg text-stone-600">
            List the ingredients in your kitchen and get recipes that use the
            most of them, or let it pick tonight&apos;s dinner for you.
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
          <p className="text-center text-stone-500">
            Your recipes will appear here.
          </p>
        )}
        {view.kind === "loading" && <LoadingGrid label={view.label} />}
        {view.kind === "error" && (
          <p
            role="alert"
            className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-800"
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

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        Recipe data from Spoonacular · Built by{" "}
        <a
          className="font-medium text-stone-700 underline"
          href="https://joseph-react-portfolio.vercel.app"
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
      <p className="mb-4 text-stone-600">{label}</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="aspect-[4/3] animate-pulse bg-stone-200" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
