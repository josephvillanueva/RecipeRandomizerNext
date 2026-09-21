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
      className="rounded-2xl bg-white p-4 shadow-lg shadow-stone-200/70 ring-1 ring-stone-200 sm:p-5"
    >
      <label htmlFor="ingredient-input" className="text-sm font-semibold text-stone-700">
        Ingredients you have
      </label>

      <div className="mt-2 flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-stone-300 px-3 py-2 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 py-1 pl-3 pr-1 text-sm font-medium text-emerald-900"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(chip)}
              aria-label={`Remove ${chip}`}
              className="grid h-5 w-5 place-items-center rounded-full hover:bg-emerald-200"
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
          placeholder={chips.length ? "Add another..." : "Type an ingredient and press Enter"}
          aria-describedby="ingredient-hint"
          className="min-w-[10rem] flex-1 border-0 bg-transparent py-1 text-base outline-none placeholder:text-stone-400 focus-visible:outline-none"
        />
      </div>
      <p id="ingredient-hint" className="mt-2 text-sm text-stone-500">
        Press Enter or type a comma after each ingredient. Backspace removes
        the last one.
      </p>

      {chips.length === 0 && !draft && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-stone-500">Try:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => addChips([example])}
              className="rounded-full border border-stone-300 px-3 py-1 text-stone-700 hover:border-emerald-600 hover:text-emerald-800"
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
          className="rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Find recipes
        </button>
        <button
          type="button"
          onClick={onSurprise}
          disabled={busy}
          className="rounded-xl bg-amber-400 px-5 py-2.5 font-semibold text-stone-900 shadow-sm transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Surprise me
        </button>
        {(chips.length > 0 || draft) && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto rounded-xl px-4 py-2.5 font-medium text-stone-600 hover:bg-stone-100"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
