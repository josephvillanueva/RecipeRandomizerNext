"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";

interface RecipeFilterProps {
  onSearch: (ingredients: string[]) => void;
  onSurprise: () => void;
  onClear: () => void;
  busy: boolean;
}

const EXAMPLES = ["chicken", "rice", "garlic", "tomato", "egg", "spinach"];

function parse(text: string): string[] {
  return text
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export default function RecipeFilter({
  onSearch,
  onSurprise,
  onClear,
  busy,
}: RecipeFilterProps) {
  const [chips, setChips] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const addChips = (items: string[]) => {
    if (items.length === 0) return;
    setChips((current) => [...new Set([...current, ...items])]);
  };

  const removeChip = (chip: string) =>
    setChips((current) => current.filter((c) => c !== chip));

  const handleChange = (value: string) => {
    // A comma, typed or pasted, turns everything before it into chips.
    if (value.includes(",")) {
      const parts = value.split(",");
      addChips(parse(parts.slice(0, -1).join(",")));
      setDraft(parts[parts.length - 1]);
    } else {
      setDraft(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && draft.trim()) {
      event.preventDefault();
      addChips(parse(draft));
      setDraft("");
    } else if (event.key === "Backspace" && !draft && chips.length > 0) {
      setChips((current) => current.slice(0, -1));
    }
  };

  const allIngredients = [...new Set([...chips, ...parse(draft)])];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (allIngredients.length === 0) return;
    setChips(allIngredients);
    setDraft("");
    onSearch(allIngredients);
  };

  const handleClear = () => {
    setChips([]);
    setDraft("");
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <label
        htmlFor="ingredient-input"
        className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
      >
        Ingredients you have
      </label>

      <div className="mt-2 flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 dark:border-zinc-700 dark:focus-within:border-emerald-400">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 py-1 pl-3 pr-1 text-sm font-medium text-emerald-900 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-800"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(chip)}
              aria-label={`Remove ${chip}`}
              className="grid h-5 w-5 place-items-center rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id="ingredient-input"
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={chips.length ? "Add another" : "Type an ingredient, then press Enter"}
          aria-describedby="ingredient-hint"
          className="min-w-40 flex-1 border-0 bg-transparent py-1 text-base outline-hidden placeholder:text-zinc-500 focus-visible:outline-hidden dark:placeholder:text-zinc-500"
        />
      </div>
      <p id="ingredient-hint" className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Press Enter or type a comma after each one. Backspace removes the last.
      </p>

      {chips.length === 0 && !draft && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Try:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => addChips([example])}
              className="rounded-full border border-zinc-300 px-3 py-1 text-zinc-700 transition hover:border-emerald-600 hover:text-emerald-800 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
            >
              + {example}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={allIngredients.length === 0 || busy}
          className="rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
        >
          Find recipes
        </button>
        <button
          type="button"
          onClick={onSurprise}
          disabled={busy}
          className="rounded-xl border border-zinc-300 px-5 py-2.5 font-semibold text-zinc-800 transition hover:bg-zinc-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Surprise me
        </button>
        {(chips.length > 0 || draft) && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto rounded-xl px-4 py-2.5 font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
